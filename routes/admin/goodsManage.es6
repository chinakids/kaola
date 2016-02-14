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

R.get('/?add', getAccess('goodsManage-add'), function*(next) {
  yield render('goodsAdd', {
    title: '添加商品',
    desc: ''
  }, this);
});

export default R;
