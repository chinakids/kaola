import router from 'koa-router';
import render from './../../utils/render';
import goodsModel from './../../models/Goods';
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
 * 商品管理相关
 */

//商品管理
R.get('/', check.access('goodsManage-view'), function*(next) {
  let query = this.request.query;
  let count = yield goodsModel.count({});
  let goodFetch = yield goodsModel.fetch(query.page,query.limit);
  yield render('goodsManage', {
    title: '商品管理',
    desc: '',
    page: getPageCount(count,query.page,query.limit),
    goodList: JSON.stringify(goodFetch)
  }, this);
});
//添加商品
R.get('/addGood', check.access('goodsManage-add'), function*(next) {
  let categoriesList = yield categoryModel.fetch();
  yield render('goodsAdd', {
    title: '添加商品',
    desc: '',
    categoriesList:JSON.stringify(cf.tree(categoriesList))
  }, this);
});

R.post('/addGood', check.access('goodsManage-add'), setTag, function*(next) {
  let parm = this.request.body;
  parm.author = this.session.userInfo._id;
  parm.imgList = copyImage(parm.imgList,'goods');
  let good = new goodsModel(parm)
  yield good.add()
  //日志记录
  setLog('新增',`新增商品<<${parm.title}>>成功`,this);
  this.body = {
    status: 'SUCCESS::成功发布商品'
  }
});
//修改商品
R.get('/editGood', check.access('goodsManage-edit'), function*(next) {
  let parm = this.request.query;
  let good = yield goodsModel.findById(parm.id);
  let categoriesList = yield categoryModel.fetch();
  if (good.length <= 0) {
    this.body = {
      status: 'FAIL::该商品不存在'
    }
  } else {
    yield render('goodsEdit', {
      title: '修改商品',
      desc: '',
      goodData:JSON.stringify(good[0]),
      categoriesList:JSON.stringify(cf.tree(categoriesList))
    }, this);
  }
});
R.post('/editGood', check.access('goodsManage-edit'), setTag, function*(next) {
  let parm = this.request.body;
  let good = yield goodsModel.findById(parm._id);
  if (good.length <= 0) {
    this.body = {
      status: 'FAIL::该商品不存在'
    }
  } else {
    parm.imgList = copyImage(parm.imgList,'goods');
    //合并
    let _good = Object.assign(good[0], parm);
    yield _good.save();
    //日志记录
    setLog('修改',`修改商品<<${_good.title}>>成功`,this);
    this.body = {
      status: 'SUCCESS::成功修改修改商品信息'
    }
  }
});
//修改商品 - 置顶
R.post('/editGoodTop', check.access('goodsManage-edit'), function*(next) {
  let parm = this.request.body;
  let good = yield goodsModel.findById(parm.id);
  if (good.length <= 0) {
    this.body = {
      status: 'FAIL::该商品不存在'
    }
  } else {
    //合并
    good[0].state.top = !good[0].state.top;
    yield good[0].save();
    //日志记录
    setLog('置顶',`置顶商品<<${good[0].title}>>成功`,this);
    this.body = {
      status: 'SUCCESS::'+(good[0].state.top?'成功置顶':'取消置顶')
    }
  }
});
//修改商品 - 销售状态
R.post('/editGoodSell', check.access('goodsManage-edit'), function*(next) {
  let parm = this.request.body;
  let good = yield goodsModel.findById(parm.id);
  if (good.length <= 0) {
    this.body = {
      status: 'FAIL::该商品不存在'
    }
  } else {
    //合并
    good[0].state.sell = !good[0].state.sell;
    yield good[0].save();
    //日志记录
    setLog((article[0].state.sell?'下架':'上架'),`${(article[0].state.sell?'下架':'上架')}商品<<${article[0].title}>>成功`,this);
    this.body = {
      status: 'SUCCESS::'+(good[0].state.sell?'下架成功':'上架成功')
    }
  }
});
//修改商品 - 显示
R.post('/editGoodDisplay', check.access('goodsManage-edit'), function*(next) {
  let parm = this.request.body;
  let good = yield goodsModel.findById(parm.id);
  if (good.length <= 0) {
    this.body = {
      status: 'FAIL::该商品不存在'
    }
  } else {
    //合并
    good[0].state.display = !good[0].state.display;
    yield good[0].save();
    //日志记录
    setLog((article[0].state.display?'显示':'隐藏'),`${(article[0].state.display?'显示':'隐藏')}商品<<${article[0].title}>>成功`,this);
    this.body = {
      status: 'SUCCESS::'+(good[0].state.display?'开启显示':'取消显示')
    }
  }
});
//删除商品
R.post('/delGood', check.access('goodsManage-del'), function*(next) {
  let parm = this.request.body;
  let good = yield goodsModel.findById(parm.id);
  if (good.length <= 0) {
    this.body = {
      status: 'FAIL::该商品不存在'
    }
  } else {
    yield good[0].del();
    //日志记录
    setLog('删除',`删除商品<<${article[0].title}>>成功`,this);
    this.body = {
      status: 'SUCCESS::成功删除商品'
    }
  }
});
export default R;
