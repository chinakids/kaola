import router from 'koa-router';
import render from './../utils/render';
import mixList from './../controller/mixList';
import tagModel from './../models/Tags';
import goodsModel from './../models/Goods';
import articlesModel from './../models/Articles';

let R = router();

R.get('/', function *(next) {
  let ranking = yield tagModel.ranking(5);
  let goodFetch = yield goodsModel.fetch();
  let articleFetch = yield articlesModel.fetch();
  let list = mixList(goodFetch,articleFetch);
  console.log(list);
  yield render('index',{
    title: '首页',
    hot:ranking,
    list:JSON.stringify(list)
  },this);
});


export default R;
