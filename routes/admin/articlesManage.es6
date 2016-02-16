import router from 'koa-router';
import render from './../../utils/render';
import _ from 'underscore';
import articlesModel from './../../models/Articles';
import getPageCount from './../../controller/getPageCount';
import getAccess from './../../controller/getAccess';
import setTag from './../../controller/setTag';

let R = router();
/**
 * 文章管理相关
 */

R.use(function*(next) {
  if(this.session.login  && !this.session.locked){
    yield next;
  }else{
    if(!this.session.login){
      if(this.request.method === 'GET'){
        this.redirect('./login')
      }else{
        this.body = {
          status: 'FAIL::该接口需要登录'
        }
      }
    }else if(this.session.locked){
      if(this.request.method === 'GET'){
        this.redirect('./lock')
      }else{
        this.body = {
          status: 'FAIL::当前账号已被锁定'
        }
      }
    }
  }
})
//文章管理
R.get('/', getAccess('articlesManage-view'), function*(next) {
  let count = yield articlesModel.count({});
  let articleFetch = yield articlesModel.fetch();
  yield render('articlesManage', {
    title: '文章管理',
    desc: '',
    page: JSON.stringify(getPageCount(count)),
    articleList: JSON.stringify(articleFetch)
  }, this);
});
//添加文章
R.get('/addArticle', getAccess('articlesManage-add'), function*(next) {
  yield render('articlesAdd', {
    title: '添加文章',
    desc: ''
  }, this);
});

R.post('/addArticle', getAccess('articlesManage-add'), setTag, function*(next) {
  let parm = this.request.body;
  parm.author = this.session.userInfo._id;
  let article = new articlesModel(parm)
  yield article.add()
  this.body = {
    status: 'SUCCESS::成功发布文章'
  }
});
//修改文章
R.get('/editArticle', getAccess('articlesManage-edit'), function*(next) {
  let parm = this.request.query;
  let article = yield articlesModel.findById(parm.id);
  if (article.length <= 0) {
    this.body = {
      status: 'FAIL::该文章不存在'
    }
  } else {
    yield render('articlesEdit', {
      title: '修改文章',
      desc: '',
      articleData:JSON.stringify(article[0])
    }, this);
  }
});
R.post('/editArticle', getAccess('articlesManage-edit'), setTag, function*(next) {
  let parm = this.request.body;
  let article = yield articlesModel.findById(parm._id);
  if (article.length <= 0) {
    this.body = {
      status: 'FAIL::该文章不存在'
    }
  } else {
    //合并
    let _article = _.extend(article[0], parm);
    yield _article.save();
    this.body = {
      status: 'SUCCESS::成功修改修改文章信息'
    }
  }
});
//修改文章 - 置顶
R.post('/editArticleTop', getAccess('articlesManage-edit'), function*(next) {
  let parm = this.request.body;
  let article = yield articlesModel.findById(parm.id);
  if (article.length <= 0) {
    this.body = {
      status: 'FAIL::该文章不存在'
    }
  } else {
    //合并
    article[0].state.top = !article[0].state.top;
    yield article[0].save();
    this.body = {
      status: 'SUCCESS::'+(article[0].state.top?'成功置顶':'取消置顶')
    }
  }
});
//修改文章 - 显示
R.post('/editArticleDisplay', getAccess('articlesManage-edit'), function*(next) {
  let parm = this.request.body;
  let article = yield articlesModel.findById(parm.id);
  if (article.length <= 0) {
    this.body = {
      status: 'FAIL::该文章不存在'
    }
  } else {
    //合并
    article[0].state.display = !article[0].state.display;
    yield article[0].save();
    this.body = {
      status: 'SUCCESS::'+(article[0].state.display?'开启显示':'取消显示')
    }
  }
});
//删除文章
R.post('/delArticle', getAccess('articlesManage-del'), function*(next) {
  let parm = this.request.body;
  let article = yield articlesModel.findById(parm.id);
  if (article.length <= 0) {
    this.body = {
      status: 'FAIL::该文章不存在'
    }
  } else {
    yield article[0].del();
    this.body = {
      status: 'SUCCESS::成功删除文章'
    }
  }
});
export default R;
