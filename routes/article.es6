import router from 'koa-router';
import render from './../utils/render';
import goodsModel from './../models/Goods';
import articlesModel from './../models/Articles';
import userLikeModel from './../models/UserLike';
import marked from 'marked';

let R = router();

R.get('/:id', function *(next) {
  let [ article ] = yield articlesModel.findById(this.params.id,true);
  let userGoodCount = yield goodsModel.count({author:article.author._id}) //读取用户发布商品总量
  let userArticleCount = yield articlesModel.count({author:article.author._id}) //读取用户文章总量
  if(this.session.login){
    let [ userLike ] = yield userLikeModel.findByArticle(this.params.id, this.session.userInfo._id)
    article.isLike = userLike ? true : false;
  }else{
    article.isLike = false;
  }
  article.contentHTML = marked(article.content);
  article.userGoodCount = userGoodCount;
  article.userArticleCount = userArticleCount;
  if(article){
    //浏览加1
    if(!this.cookies.get('view')){
      let _article = Object.assign(article, {statistics:{view:article.statistics.view + 1}});
      yield _article.save();
      this.cookies = this.cookies.set('view', '1', { signed:false, path: this.request.path,httpOnly:true });
    }
    yield render('article',{
      title: article.title,
      desc:'',
      data:article
    },this);
  }
});

export default R;
