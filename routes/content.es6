import router from 'koa-router';
import render from './../utils/render';
import goodsModel from './../models/Goods';
import articlesModel from './../models/Articles';
import userLikeModel from './../models/UserLike';
import marked from 'marked';

let R = router();

R.get('/:category/:title', function *(next) {
  let [ good ] = yield goodsModel.findById(this.params.id,true); //true安全读取模式
  let userGoodCount = yield goodsModel.count({author:good.author._id}) //读取用户发布商品总量
  let userArticleCount = yield articlesModel.count({author:good.author._id}) //读取用户文章总量
  if(this.session.login){
    let [ userLike ] = yield userLikeModel.findByGood(this.params.id, this.session.userInfo._id)
    good.isLike = userLike ? true : false;
  }else{
    good.isLike = false;
  }
  good.contentHTML = marked(good.content);
  good.userGoodCount = userGoodCount;
  good.userArticleCount = userArticleCount;
  if(good){
    //浏览加1
    if(!this.cookies.get('view')){
      let _good = Object.assign(good, {statistics:{view:good.statistics.view + 1}});
      yield _good.save();
      this.cookies = this.cookies.set('view', '1', { signed:false, path: this.request.path,httpOnly:true });
    }
    yield render('good',{
      title: good.title,
      desc:'',
      data:good
    },this);
  }
});

export default R;
