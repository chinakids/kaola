import router from 'koa-router';
import crypto from 'crypto';
import render from './../utils/render';
import usersModel from './../models/Users';
import check from './../controller/getAccess';

let R = router();

R.get('/', check.isLogin(), function*(next) {
  yield render('index', {
    title: '用户中心',
    desc: '',
  }, this);
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
  let [ user ] = yield usersModel.findUserByEmail(parm.email);
  if (!user) {
    this.body = {
      status: 'FAIL::用户不存在'
    }
  } else {
    let ticket = md5.update((user.password + this.session.ccap).toUpperCase()).digest('hex');
    if (parm.ticket.toUpperCase() === ticket.toUpperCase()) {
      this.session.email = parm.email;
      this.session.login = true;
      this.session.locked = false;
      this.session.ccap = '';
      this.session.userInfo = user;
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

//注册接口
R.get('/register', function *(next) {
  if (!this.session.login) {
    yield render('register', {
      title: '用户注册',
      desc: ''
    }, this);
  } else {
    this.redirect('./')
  }
});

R.post('/register', function *(next){
  let parm = this.request.body;
  let md5 = crypto.createHash('md5');
  let [ user ] = yield usersModel.findUserByEmail(parm.email);
  if (user) {
    this.body = {
      status: 'FAIL::该邮箱已存在'
    }
  } else {
    let user = new usersModel({
      nickName: parm.nickName,
      email: parm.email,
      password: md5.update(parm.password).digest('hex'),
      phoneNum: parm.phoneNum,
      admin: false,
      group: 'unactivated' //从后台添加的默认为激活账户
    })
    yield user.add()
    this.body = {
      status: 'SUCCESS::成功增加会员账号'
    }
  }
})



export default R;
