import router from 'koa-router';
import render from './../../utils/render';
import tagModel from './../../models/Tags';
import getPageCount from './../../controller/getPageCount';
import check from './../../controller/getAccess';
import setLog from './../../controller/setLog';

let R = router();

R.use(check.login())
/**
 * 3.商品管理相关
 */


//标签管理
R.get('/', check.access('tagManage-view'), function*(next) {
  let query = this.request.query;
  //查询条件
  let regex = new RegExp(query.search,'i');
  let search = query.search ? {$or:[{name:{$regex:regex}}]} : {};

  let count = yield tagModel.count(search);
  let fetch = yield tagModel.fetch(query.page,query.limit,search);
  let ranking = yield tagModel.ranking(5);
  yield render('tagsManage', {
    title: '标签统计',
    desc: '',
    page: getPageCount(count,query.page,query.limit ? query.limit : 100),
    tagList: JSON.stringify(fetch),
    ranking: JSON.stringify(ranking)
  }, this);
});

export default R;
