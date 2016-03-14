import router from 'koa-router';
import render from './../utils/render';
import tagModel from './../models/Tags';
import goodsModel from './../models/Goods';

let R = router();

R.get('/', function *(next) {
  let ranking = yield tagModel.ranking(5);
  let goodFetch = yield goodsModel.fetch();
  yield render('index',{
    title: '首页',
    hot:ranking,
    list:JSON.stringify(goodFetch)
  },this);
});


export default R;
