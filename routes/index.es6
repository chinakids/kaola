import router from 'koa-router';
import render from './../utils/render';

let R = router();

R.get('/', function *(next) {
  yield render('index',{
    title: '首页'
  },this);
});


export default R;
