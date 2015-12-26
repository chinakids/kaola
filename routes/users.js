import router from 'koa-router'

let R = router()

R.get('/', function *(next) {
  this.body = 'this a users response!';
});

export default R;
