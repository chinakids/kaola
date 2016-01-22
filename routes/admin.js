import router from 'koa-router';
import render from './../utils/render';
import ccap from 'ccap';

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
  this.body = 'this a admin response!'+this.session.login;
});

R.get('/logout', function *(next) {
  this.body = 'this a admin response!';
});

export default R;
