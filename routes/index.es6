import router from 'koa-router';
import render from './../utils/render';
import mixList from './../controller/mixList';
import tagModel from './../models/Tags';
import goodsModel from './../models/Goods';
import articlesModel from './../models/Articles';

let R = router();

R.get('/', function *(next) {
  let hot = yield tagModel.ranking(6);
  let goodFetch = yield goodsModel.fetch();
  let articleFetch = yield articlesModel.fetch();
  let list = mixList(goodFetch,articleFetch);
  yield render('index',{
    title: '首页',
    desc:'',
    hot:hot,
    list:JSON.stringify(list)
  },this);
});


export default R;
