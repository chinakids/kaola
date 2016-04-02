import router from 'koa-router';
import render from './../utils/render';
import mixList from './../controller/mixList';
import tagModel from './../models/Tags';
import goodsModel from './../models/Goods';
import articlesModel from './../models/Articles';

let R = router();

R.get('/', function *(next) {
  let query = this.request.query;
  let search = query.keyword ? {$or:[{nickName:{$regex:regex}},{email:{$regex:regex}},{phone:{$regex:regex}}]} : {};
  let hot = yield tagModel.ranking(6);
  let goodFetch = yield goodsModel.fetch({'state.display':true});
  let articleFetch = yield articlesModel.fetch({'state.display':true});
  let list = mixList(goodFetch,articleFetch);
  yield render('index',{
    title: '首页',
    desc:'',
    hot:hot,
    list:list
  },this);
});


export default R;
