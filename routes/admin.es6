import router from 'koa-router';
import render from './../utils/render';
import ccap from 'ccap';
import _ from 'underscore';
import crypto from 'crypto';
import usersModel from './../models/Users';
import userGroupModel from './../models/UserGroup';
import getPageCount from './../controller/getPageCount';
import S from './../conf/setting';
//route
import goodsManage from './admin/goodsManage';
import adminManage from './admin/adminManage';
import articlesManage from './admin/articlesManage';
import groupManage from './admin/groupManage';
import backupsManage from './admin/backupsManage';

let R = router();
//获取最新权限

R.get('/', function*(next) {
  if (this.session.login) {
    yield render('index', {
      title: '管理面板',
      desc: '日常管理面板'
    }, this);
  } else {
    this.redirect('./login')
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
      title: '管理员登陆'
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
      this.session.ccap = '';
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

R.use('/goodsManage', goodsManage.routes(), goodsManage.allowedMethods());
R.use('/adminManage', adminManage.routes(), adminManage.allowedMethods());
R.use('/articlesManage', articlesManage.routes(), articlesManage.allowedMethods());
R.use('/groupManage', groupManage.routes(), groupManage.allowedMethods());
R.use('/backupsManage', backupsManage.routes(), backupsManage.allowedMethods());

export default R;
