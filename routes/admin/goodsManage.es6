import router from 'koa-router';
import render from './../../utils/render';
import _ from 'underscore';
import goodsModel from './../../models/Goods';
import getPageCount from './../../controller/getPageCount';
import getAccess from './../../controller/getAccess';
import setTag from './../../controller/setTag';

let R = router();
/**
 * 商品管理相关
 */

R.use(function*(next) {
  if(this.session.login){
    yield next;
  }else{
    if(this.request.method === 'GET'){
      this.redirect('./login')
    }else{
      this.body = {
        status: 'FAIL::该接口需要登录'
      }
    }
  }
})
//商品管理
R.get('/', getAccess('goodsManage-view'), function*(next) {
  let count = yield goodsModel.count({});
  let goodFetch = yield goodsModel.fetch();
  yield render('goodsManage', {
    title: '商品管理',
    desc: '',
    page: JSON.stringify(getPageCount(count)),
    goodList: JSON.stringify(goodFetch)
  }, this);
});
//添加商品
R.get('/addGood', getAccess('goodsManage-add'), function*(next) {
  yield render('goodsAdd', {
    title: '添加商品',
    desc: ''
  }, this);
});

R.post('/addGood', getAccess('goodsManage-add'), setTag, function*(next) {
  let parm = this.request.body;
  parm.author = this.session.userInfo._id;
  let good = new goodsModel(parm)
  yield good.add()
  this.body = {
    status: 'SUCCESS::成功发布商品'
  }
});
//修改商品
R.get('/editGood', getAccess('goodsManage-edit'), function*(next) {
  let parm = this.request.query;
  let good = yield goodsModel.findById(parm.id);
  if (good.length <= 0) {
    this.body = {
      status: 'FAIL::该商品不存在'
    }
  } else {
    yield render('goodsEdit', {
      title: '修改商品',
      desc: '',
      goodData:JSON.stringify(good[0])
    }, this);
  }
});
R.post('/editGood', getAccess('goodsManage-edit'), setTag, function*(next) {
  let parm = this.request.body;
  let good = yield goodsModel.findById(parm._id);
  if (good.length <= 0) {
    this.body = {
      status: 'FAIL::该商品不存在'
    }
  } else {
    //合并
    let _good = _.extend(good[0], parm);
    yield _good.save();
    this.body = {
      status: 'SUCCESS::成功修改修改商品信息'
    }
  }
});
//修改商品 - 置顶
R.post('/editGoodTop', getAccess('goodsManage-edit'), function*(next) {
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
    this.body = {
      status: 'SUCCESS::'+(good[0].state.top?'成功置顶':'取消置顶')
    }
  }
});
//修改商品 - 销售状态
R.post('/editGoodSell', getAccess('goodsManage-edit'), function*(next) {
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
    this.body = {
      status: 'SUCCESS::'+(good[0].state.sell?'下架成功':'上架成功')
    }
  }
});
//修改商品 - 显示
R.post('/editGoodDisplay', getAccess('goodsManage-edit'), function*(next) {
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
    this.body = {
      status: 'SUCCESS::'+(good[0].state.display?'开启显示':'取消显示')
    }
  }
});
//删除商品
R.post('/delGood', getAccess('goodsManage-del'), function*(next) {
  let parm = this.request.body;
  let good = yield goodsModel.findById(parm.id);
  if (good.length <= 0) {
    this.body = {
      status: 'FAIL::该商品不存在'
    }
  } else {
    yield good[0].del();
    this.body = {
      status: 'SUCCESS::成功删除商品'
    }
  }
});
export default R;
