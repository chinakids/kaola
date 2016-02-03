import router from 'koa-router';
import render from './../utils/render';
import ccap from 'ccap';
import crypto from 'crypto';
import usersModel from '../models/Users';
import getPageCount from './../controller/getPageCount';

let R = router();

/**
 * 0、初始化
 */

R.get('/init', function *(next) {
  //还要创建root限权
  yield render('init',{
    title: '初始化账户'
  },this);
});

R.post('/init', function *(next) {
  let parm = this.request.body;
  let md5 = crypto.createHash('md5');
  let checking = yield usersModel.findAdminByEmail(parm.email);
  if(checking.length > 0){
    this.body = {
      status : 'FAIL::该邮箱已存在'
    }
  }else{
    let user = new usersModel({
      nickName   : parm.nickName,
      email      : parm.email,
      password   : md5.update(parm.password).digest('hex'),
      phoneNum   : parm.phoneNum,
      admin      : true
    })
    yield user.add()
    this.body = {
      status : 'SUCCESS::初始化成功'
    }
  }
});

/**
 * 1、登陆相关
 */

//登陆
R.get('/login', function *(next) {
  yield render('login',{
    title: '管理员登陆'
  },this);
});
//登陆接口
R.post('/login', function *(next) {
  let parm = this.request.body;
  let md5 = crypto.createHash('md5');
  let result = yield usersModel.findAdminByEmail(parm.email);
  if(result.length <= 0){
    this.body = {
      status : 'FAIL::用户不存在'
    }
  }else {
    let ticket = md5.update((result[0].password + this.session.ccap).toUpperCase()).digest('hex');
    if(parm.ticket.toUpperCase() === ticket.toUpperCase()){
      this.session.email = parm.email;
      this.session.login = true;
      this.body = {
        status : 'SUCCESS::登陆成功'
      }
    }else{
      this.body = {
        status : 'FAIL::密码或验证码错误'
      }
    }
  }
});
//登出
R.all('/logout', function *(next) {
  if(this.request.method === 'GET'){
    this.session.login = false;
    this.session.userInfo = null;
    this.redirect('./login');
  }else if(this.request.method === 'POST'){
    this.session.login = false;
    this.session.userInfo = null;
    this.body = {
      status : 'SUCCESS::退出登陆'
    }
  }else{
    this.body = {
      status : 'FAIL::此接口不接受其他请求模式'
    }
  }
});

/**
 * 2、管理面板
 */

//控制面板
R.get('/', function *(next) {
  if(this.session.login){
    yield render('index',{
      title: '管理面板',
      desc: '日常管理面板'
    },this);
  }else{
    this.redirect('./login')
  }
});

/**
 * 3.商品管理相关
 */

R.get('/goodsManage', function *(next) {
  if(this.session.login){
    yield render('goodsManage',{
      title: '商品管理',
      desc: ''
    },this);
  }else{
    this.redirect('./login')
  }
});


/**
 * 4.系统管理相关
 */

R.get('/groupManage', function *(next) {
  if(this.session.login){
    yield render('groupManage',{
      title: '权限组管理',
      desc: ''
    },this);
  }else{
    this.redirect('./login')
  }
});

R.get('/adminManage', function *(next) {
  if(this.session.login){
    let count = yield usersModel.count({});
    let fetch = yield usersModel.findAdmin();
    yield render('adminManage',{
      title: '系统用户管理',
      desc: '',
      page:JSON.stringify(getPageCount(count)),
      adminList:JSON.stringify(fetch)
    },this);
  }else{
    this.redirect('./login')
  }
});

export default R;
