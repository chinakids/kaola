import router from 'koa-router';
import render from './../utils/render';
import mixList from './../controller/mixList';
// import tagModel from './../models/Tags';
import goodsModel from './../models/Goods';
import articlesModel from './../models/Articles';

let R = router();

R.get('/', function *(next) {
  let query = this.request.query;
  let regex = new RegExp(query.search,'i');
  let search = query.keyword ? {$or:[{title:{$regex:regex}},{'info.callWay':{$regex:regex}},{content:{$regex:regex}},{tag:{$regex:regex}}]} : {};
  let goodFetch = yield goodsModel.fetch({...{'state.display':true},...search});
  let articleFetch = yield articlesModel.fetch({...{'state.display':true},...search});
  let list = mixList(goodFetch,articleFetch);
  this.body = list
  // yield render('search',{
  //   title: '搜索结果',
  //   desc:'',
  //   list:list
  // },this);
});


export default R;
