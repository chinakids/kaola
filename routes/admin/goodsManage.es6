import router from 'koa-router';
import render from './../../utils/render';
import goodsModel from './../../models/Goods';
import getPageCount from './../../controller/getPageCount';
import getAccess from './../../controller/getAccess';

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

R.post('/addGood', getAccess('goodsManage-add'), function*(next) {
  let parm = this.request.body;
  parm.author = this.session.userInfo._id;
  let good = new goodsModel(parm)
  yield good.add()
  this.body = {
    status: 'SUCCESS::成功发布商品'
  }
});

export default R;
