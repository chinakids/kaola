import router from 'koa-router';
import render from './../../utils/render';

let R = router();
/**
 * 3.商品管理相关
 */

R.use(function*(next) {
  console.log('商品管理')
  yield next;
})

R.get('/', getAccess('goodsManage-view'), function*(next) {
  if (this.session.login) {
    //if (getAccess(this, 'goodsManage-view')) {
    yield render('goodsManage', {
      title: '商品管理',
      desc: ''
    }, this);
    // } else {
    //   //TODO
    //   this.body = {
    //     status: 'FAIL::没有操作权限'
    //   }
    // }
  } else {
    this.redirect('./login')
  }
});

export default R;
