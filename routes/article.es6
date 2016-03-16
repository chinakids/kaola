import router from 'koa-router';
import render from './../utils/render';
import goodsModel from './../models/Goods';
import articlesModel from './../models/Articles';
import marked from 'marked';

let R = router();

R.get('/:id', function *(next) {
  let article = yield articlesModel.findById(this.params.id,true);
  let userGoodCount = yield goodsModel.count({author:good[0].author._id}) //读取用户发布商品总量
  let userArticleCount = yield articlesModel.count({author:good[0].author._id}) //读取用户文章总量
  article[0].contentHTML = marked(article[0].content);
  article[0].userGoodCount = userGoodCount;
  article[0].userArticleCount = userArticleCount;
  if(article.length > 0){
    console.log(this.cookies.get('view'));
    console.log(this.request.cookies)
    //浏览加1
    if(!this.cookies.get('view')){
      let _good = Object.assign(article[0], {statistics:{view:article[0].statistics.view + 1}});
      yield _good.save();
      this.cookies = this.cookies.set('view', '1', { signed:false, path: this.request.path,httpOnly:true });
    }
    yield render('article',{
      title: article[0].title,
      desc:'',
      data:article[0]
    },this);
  }
});

export default R;
