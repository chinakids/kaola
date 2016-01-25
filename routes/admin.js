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

R.get('/', function *(next) {
  this.body = this.session.userInfo;
});

R.get('/login', function *(next) {
  yield render('login','backend', {
    title: '管理员登陆'
  },this);
});

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
        msg : 'FAIL::用户不存在'
      }
    }else {
      let result = data[0];
      let ticket = md5.update((result.password + this.session.ccap).toUpperCase()).digest('hex');
      if(parm.ticket.toUpperCase() === ticket.toUpperCase()){
        this.session.email = parm.email;
        this.session.login = true;
        this.body = {
          msg : 'SUCCESS::登陆成功'
        }
      }else{
        this.body = {
          msg : 'FAIL::密码或验证码错误'
        }
      }
    }
  });

});

R.get('/logout', function *(next) {
  this.body = 'this a admin response!';
});

export default R;
