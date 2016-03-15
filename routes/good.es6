import router from 'koa-router';
import render from './../utils/render';

let R = router();

R.get('/:id', function *(next) {
  yield render('good',{
    title: '首页',
    desc:'',
    id:this.params.id
  },this);
});


export default R;
