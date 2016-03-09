import router from 'koa-router';
import crypto from 'crypto';
import render from './../utils/render';
import usersModel from './../models/Users';

let R = router();


R.get('/', function*(next) {
  if (this.session.login) {
    yield render('index', {
      title: '用户中心',
      desc: '',
    }, this);
  } else {
    this.redirect('./login');
  }
});

R.get('/login', function *(next) {
  if (!this.session.login) {
    yield render('login', {
      title: '用户登录',
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
  let result = yield usersModel.findUserByEmail(parm.email);
  console.log(result)
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
      this.session.userInfo = result[0];
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
export default R;
