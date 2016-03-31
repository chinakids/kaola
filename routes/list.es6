import router from 'koa-router';
import render from './../utils/render';
import goodsModel from './../models/Goods';
import articlesModel from './../models/Articles';
import userLikeModel from './../models/UserLike';

let R = router();

R.get('/', function *(next) {
  let query = this.request.query;
  if(query.type==='good'){
    let list = yield goodsModel.fetch({'state.display':true});
    yield render('list',{
      title: '闲置市场',
      desc:'',
      list:list
    },this);
  }
  if(query.type==='article'){
    let list = yield articlesModel.fetch({'state.display':true});
    yield render('list',{
      title: '资讯广场',
      desc:'',
      list:list
    },this);
  }
});

export default R;
