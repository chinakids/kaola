import router from 'koa-router'

let R = router()

R.get('/', function *(next) {
  yield this.render('index', {
    title: 'Hello World Kaola!'+this.session.name
  });
});

export default R;
