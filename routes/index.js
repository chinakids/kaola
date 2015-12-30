import router from 'koa-router'

let R = router()

R.get('/', function *(next) {
  console.log('////');
  console.log(this.session.name)
  this.session.name = 'koa-redis';
  yield this.render('index', {
    title: 'Hello World Kaola!'
  });
});

export default R;
