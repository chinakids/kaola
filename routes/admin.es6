import router from 'koa-router';
import render from './../utils/render';
import ccap from 'ccap';
import crypto from 'crypto';
import getPageCount from './../controller/getPageCount';
import setLog from './../controller/setLog';
import S from './../conf/setting';
//model
import userGroupModel from './../models/UserGroup';
import goodsModel from './../models/Goods';
import usersModel from './../models/Users';
import articlesModel from './../models/Articles';
//route
import goodsManage from './admin/goodsManage';
import adminManage from './admin/adminManage';
import articlesManage from './admin/articlesManage';
import groupManage from './admin/groupManage';
import backupsManage from './admin/backupsManage';
import usersManage from './admin/usersManage';
import tagsManage from './admin/tagsManage';
import categoriesManage from './admin/categoriesManage';
import logsManage from './admin/logsManage';
import filesManage from './admin/filesManage';

let R = router();
//获取最新权限

R.get('/', function*(next) {
  //日志记录
  let goodsCount = yield goodsModel.count({});
  let articlesCount = yield articlesModel.count({});
  let usersCount = yield usersModel.count({});
  let newUsers = yield usersModel.getNewUsers(5);
  if (this.session.login && !this.session.locked) {
    yield render('index', {
      title: '管理面板',
      desc: '日常管理面板',
      panel:[
        {
          goodsCount:goodsCount,
          articlesCount:articlesCount,
          usersCount:usersCount,
          commentsCount:0
        },{

        },
        {
          usersCount:usersCount,
          newUsers:newUsers
        }
      ]
    }, this);
  } else {
    if(!this.session.login){
      this.redirect('./login');
    }else if(this.session.locked){
      this.redirect('./lock')
    }
  }
});
/**
 * 0、初始化
 */

R.get('/init', function*(next) {
  if (S.NEED_INIT) {} else {
    this.redirect('./login')
  }
  //还要创建root限权
  yield render('init', {
    title: '初始化账户'
  }, this);
});

R.post('/init', function*(next) {
  if (S.NEED_INIT) {
    let parm = this.request.body;
    let md5 = crypto.createHash('md5');
    //先初始化root权限组
    let checkingGroup = yield userGroupModel.findByName('root');
    let userGroup;
    if (checkingGroup.length <= 0) {
      userGroup = new userGroupModel({
        name: 'root',
        power: 'root'
      })
      yield userGroup.add();
    } else {
      userGroup = checkingGroup[0];
    }
    let checkingUser = yield usersModel.findAdminByEmail(parm.email);
    if (checkingUser.length > 0) {
      this.body = {
        status: 'FAIL::该邮箱已存在'
      }
    } else {
      let user = new usersModel({
        nickName: parm.nickName,
        email: parm.email,
        password: md5.update(parm.password).digest('hex'),
        phoneNum: parm.phoneNum,
        group: userGroup._id,
        admin: true
      })
      yield user.add()
      this.body = {
        status: 'SUCCESS::成功增加管理员账号'
      }
    }
  } else {
    this.body = {
      status: 'FAIL::系统已关闭初始化'
    }
  }
});

/**
 * 1、登陆相关
 */

//登陆
R.get('/login', function*(next) {
  if (!this.session.login) {
    yield render('login', {
      title: '管理员登陆',
      desc: ''
    }, this);
  } else {
    this.redirect('./')
  }
});
//登陆接口
R.post('/login', function*(next) {
  let parm = this.request.body;
  let md5 = crypto.createHash('md5');
  let result = yield usersModel.findAdminByEmail(parm.email);
  if (result.length <= 0) {
    this.body = {
      status: 'FAIL::用户不存在'
    }
  } else {
    let ticket = md5.update((result[0].password + this.session.ccap).toUpperCase()).digest('hex');
    if (parm.ticket.toUpperCase() === ticket.toUpperCase()) {
      this.session.email = parm.email;
      this.session.login = true;
      this.session.locked = false;
      this.session.ccap = '';
      //日志记录
      setLog('登陆',`${parm.email}登陆成功`,this);
      this.body = {
        status: 'SUCCESS::登陆成功'
      }
    } else {
      this.body = {
        status: 'FAIL::密码或验证码错误'
      }
    }
  }
});
//登出
R.all('/logout', function*(next) {
  //日志记录
  setLog('登出','账户登出',this);
  if (this.request.method === 'GET') {
    this.session.login = false;
    this.session.userInfo = null;
    this.redirect('./login');
  } else if (this.request.method === 'POST') {
    this.session.login = false;
    this.session.userInfo = null;
    this.body = {
      status: 'SUCCESS::退出登陆'
    }
  } else {
    this.body = {
      status: 'FAIL::此接口不接受其他请求模式'
    }
  }
});
//锁定
R.get('/lock', function*(next) {
  this.session.locked = true;
  //日志记录
  setLog('锁定','账户锁定',this);
  yield render('lock', {
    title: '账号已被锁定'
  }, this);
});
//解锁
R.post('/unlock', function*(next) {
  let parm = this.request.body;
  let md5 = crypto.createHash('md5');
  let result = yield usersModel.findAdminByEmail(this.session.email);
  if (result.length <= 0) {
    this.body = {
      status: 'FAIL::用户不存在'
    }
  } else {
    if (parm.ticket.toUpperCase() === result[0].password.toUpperCase()) {
      //日志记录
      setLog('解锁','账户解锁',this);
      this.session.locked = false;
      this.body = {
        status: 'SUCCESS::成功解锁'
      }
    } else {
      this.body = {
        status: 'FAIL::密码错误'
      }
    }
  }
});
R.get('/disallow', function*(next) {
  yield render('disAllow', {
    title: '没有访问权限'
  }, this);
});
R.use('/goodsManage', goodsManage.routes(), goodsManage.allowedMethods());
R.use('/adminManage', adminManage.routes(), adminManage.allowedMethods());
R.use('/articlesManage', articlesManage.routes(), articlesManage.allowedMethods());
R.use('/groupManage', groupManage.routes(), groupManage.allowedMethods());
R.use('/backupsManage', backupsManage.routes(), backupsManage.allowedMethods());
R.use('/usersManage', usersManage.routes(), usersManage.allowedMethods());
R.use('/tagsManage', tagsManage.routes(), tagsManage.allowedMethods());
R.use('/logsManage', logsManage.routes(), logsManage.allowedMethods());
R.use('/filesManage', filesManage.routes(), filesManage.allowedMethods());
R.use('/categoriesManage', categoriesManage.routes(), categoriesManage.allowedMethods());

export default R;
