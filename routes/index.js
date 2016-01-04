import router from 'koa-router';
import render from './../utils/render';

let R = router();

R.get('/', function *(next) {
  yield render('index', {
    title: 'Hello World Kaola!'+this.session.name
  },this);
});

export default R;
