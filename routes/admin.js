import router from 'koa-router';
import render from './../utils/render';
import ccap from 'ccap';
import crypto from 'crypto';
import usersModel from '../models/Users';

let securityCode = ccap({
  'width':214,
  'height':68,
  'offset':30,
  'fontsize':45
});

let R = router();
//控制面板
R.get('/', function *(next) {
  if(this.session.login){
    yield render('index','backend', {
      title: '管理面板',
      desc: '日常管理面板',
      userInfo: this.session.userInfo
    },this);
  }else{
    this.redirect('./login')
  }
});
//登陆
R.get('/login', function *(next) {
  yield render('login','backend', {
    title: '管理员登陆'
  },this);
});
//登陆接口
R.post('/login', function *(next) {
  let parm = this.request.body;
  let md5 = crypto.createHash('md5');
  let promise = new Promise((resolve, reject) => {
    usersModel.findByEmail(parm.email,(err,data) => {
      if(err){
        logger('model',err);
        reject(err);
      }else{
        resolve(data)
      };
    });
  });
  yield promise.then((data) => {
    if(data.length <= 0){
      this.body = {
        status : 'FAIL::用户不存在'
      }
    }else {
      let result = data[0];
      let ticket = md5.update((result.password + this.session.ccap).toUpperCase()).digest('hex');
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
  }
});

export default R;
