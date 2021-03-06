import router from 'koa-router';
import render from './../../utils/render';
import articlesModel from './../../models/Articles';
import categoryModel from './../../models/Categories';
import getPageCount from './../../controller/getPageCount';
import setTag from './../../controller/setTag';
import copyImage from './../../controller/copyImage';
import check from './../../controller/getAccess';
import cf from './../../controller/categoryFactory';
import setLog from './../../controller/setLog';

let R = router();

R.use(check.login())
/**
 * 文章管理相关
 */

//文章管理
R.get('/', check.access('articlesManage-view'), function*(next) {
  let query = this.request.query;
  //查询条件
  let regex = new RegExp(query.search,'i');
  let search = query.search ? {$or:[{title:{$regex:regex}},{'info.callWay':{$regex:regex}}]} : {};

  let count = yield articlesModel.count(search);
  let articleFetch = yield articlesModel.fetch(query.page,query.limit,search);
  yield render('articlesManage', {
    title: '文章管理',
    desc: '',
    page: getPageCount(count,query.page,query.limit),
    articleList: JSON.stringify(articleFetch)
  }, this);
});
//添加文章
R.get('/addArticle', check.access('articlesManage-add'), function*(next) {
  let categoriesList = yield categoryModel.fetch();
  yield render('articlesAdd', {
    title: '添加文章',
    desc: '',
    categoriesList:JSON.stringify(cf.tree(categoriesList))
  }, this);
});

R.post('/addArticle', check.access('articlesManage-add'), setTag, function*(next) {
  let parm = this.request.body;
  parm.author = this.session.userInfo._id;
  parm.imgList = copyImage(parm.imgList,'articles');
  let article = new articlesModel(parm)
  yield article.add()
  //日志记录
  setLog('新增',`新增文章<<${parm.title}>>成功`,this);
  this.body = {
    status: 'SUCCESS::成功发布文章'
  }
});
//修改文章
R.get('/editArticle', check.access('articlesManage-edit'), function*(next) {
  let parm = this.request.query;
  let [ article ] = yield articlesModel.findById(parm.id);
  let categoriesList = yield categoryModel.fetch();
  if (!article) {
    this.body = {
      status: 'FAIL::该文章不存在'
    }
  } else {
    yield render('articlesEdit', {
      title: '修改文章',
      desc: '',
      articleData:JSON.stringify(article),
      categoriesList:JSON.stringify(cf.tree(categoriesList))
    }, this);
  }
});
R.post('/editArticle', check.access('articlesManage-edit'), setTag, function*(next) {
  let parm = this.request.body;
  let [ article ] = yield articlesModel.findById(parm._id);
  if (!article) {
    this.body = {
      status: 'FAIL::该文章不存在'
    }
  } else {
    parm.imgList = copyImage(parm.imgList,'articles');
    //合并
    let _article = Object.assign(article, parm);
    yield _article.save();
    //日志记录
    setLog('修改',`修改文章<<${_article.title}>>成功`,this);
    this.body = {
      status: 'SUCCESS::成功修改修改文章信息'
    }
  }
});
//修改文章 - 置顶
R.post('/editArticleTop', check.access('articlesManage-edit'), function*(next) {
  let parm = this.request.body;
  let [ article ] = yield articlesModel.findById(parm.id);
  if (!article) {
    this.body = {
      status: 'FAIL::该文章不存在'
    }
  } else {
    //合并
    article.state.top = !article.state.top;
    yield article.save();
    //日志记录
    setLog('置顶',`置顶文章<<${article.title}>>成功`,this);
    this.body = {
      status: 'SUCCESS::'+(article.state.top?'成功置顶':'取消置顶')
    }
  }
});
//修改文章 - 显示
R.post('/editArticleDisplay', check.access('articlesManage-edit'), function*(next) {
  let parm = this.request.body;
  let [ article ] = yield articlesModel.findById(parm.id);
  if (!article) {
    this.body = {
      status: 'FAIL::该文章不存在'
    }
  } else {
    //合并
    article.state.display = !article.state.display;
    yield article.save();
    //日志记录
    setLog((article.state.display?'显示':'隐藏'),`${(article.state.display?'显示':'隐藏')}文章<<${article.title}>>成功`,this);
    this.body = {
      status: 'SUCCESS::'+(article.state.display?'开启显示':'取消显示')
    }
  }
});
//删除文章
R.post('/delArticle', check.access('articlesManage-del'), function*(next) {
  let parm = this.request.body;
  let [ article ] = yield articlesModel.findById(parm.id);
  if (!article) {
    this.body = {
      status: 'FAIL::该文章不存在'
    }
  } else {
    yield article.del();
    //日志记录
    setLog('删除',`删除文章<<${article.title}>>成功`,this);
    this.body = {
      status: 'SUCCESS::成功删除文章'
    }
  }
});
export default R;
