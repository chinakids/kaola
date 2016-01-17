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

//验证码
R.get('/securityCode',function *(next) {
  let arry = securityCode.get();
  this.session.ccap = arry[0];
  this.body = arry[1];
});

export default R;
