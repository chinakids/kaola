import router from 'koa-router';
import render from './../../utils/render';

let R = router();
/**
 * 3.商品管理相关
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
  yield render('goodsManage', {
    title: '商品管理',
    desc: ''
  }, this);
});

export default R;
