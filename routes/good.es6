import router from 'koa-router';
import render from './../utils/render';

let R = router();

R.get('/:id', function *(next) {
  console.log(this.params.id);
  this.body = this.params.id;
});


export default R;
