import router from 'koa-router';
import render from './../utils/render';

let R = router();

R.get('/', function *(next) {
  this.body = 'this a admin response!';
});

R.get('/login', function *(next) {
  yield render('login','backend', {
    title: '管理员登陆'
  },this);
});

R.post('/login', function *(next) {
  this.body = 'this a admin response!';
});

R.get('/logout', function *(next) {
  this.body = 'this a admin response!';
});

export default R;
