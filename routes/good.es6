import router from 'koa-router';
import render from './../utils/render';
import goodsModel from './../models/Goods';
import articlesModel from './../models/Articles';
import marked from 'marked';

let R = router();

R.get('/:id', function *(next) {
  let good = yield goodsModel.findById(this.params.id,true); //true安全读取模式
  let userGoodCount = yield goodsModel.count({author:good[0].author._id}) //读取用户发布商品总量
  let userArticleCount = yield articlesModel.count({author:good[0].author._id}) //读取用户文章总量
  good[0].contentHTML = marked(good[0].content);
  good[0].userGoodCount = userGoodCount;
  good[0].userArticleCount = userArticleCount;
  if(good.length > 0){
    console.log(this.cookies.get('view'));
    console.log(this.request.cookies)
    //浏览加1
    if(!this.cookies.get('view')){
      let _good = Object.assign(good[0], {statistics:{view:good[0].statistics.view + 1}});
      yield _good.save();
      this.cookies = this.cookies.set('view', '1', { signed:false, path: this.request.path,httpOnly:true });
    }
    yield render('good',{
      title: good[0].title,
      desc:'',
      data:good[0]
    },this);
  }
});

export default R;
