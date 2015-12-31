import router from 'koa-router';
import render from './../utils/render';

let R = router()

R.get('/', function *(next) {
  yield render('index', {
    title: 'Hello World Kaola!'+this.session.name
  }).then((html) => {
    this.body = html;
  })
});

export default R;
