import router from 'koa-router';
import render from './../../utils/render';
import _ from 'underscore';
import crypto from 'crypto';
import tagModel from './../../models/Tags';
import getPageCount from './../../controller/getPageCount';
import getAccess from './../../controller/getAccess';

let R = router();
/**
 * 3.商品管理相关
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

//标签管理
R.get('/', getAccess('tagManage-view'), function*(next) {
  let count = yield tagModel.count({});
  let fetch = yield tagModel.fetch();
  let ranking = yield tagModel.ranking(5);
  yield render('tagsManage', {
    title: '标签统计',
    desc: '',
    page: JSON.stringify(getPageCount(count)),
    tagList: JSON.stringify(fetch),
    ranking: JSON.stringify(ranking)
  }, this);
});

export default R;
