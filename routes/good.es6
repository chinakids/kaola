import router from 'koa-router';
import render from './../utils/render';
import goodsModel from './../models/Goods';
import marked from 'marked';

let R = router();

R.get('/:id', function *(next) {
  let good = yield goodsModel.findById(this.params.id,true);
  good[0].contentHTML = marked(good[0].content);
  yield render('good',{
    title: good[0].title,
    desc:'',
    data:good[0]
  },this);
});

export default R;
