import router from 'koa-router';
import render from './../../utils/render';
import tagModel from './../../models/Tags';
import getPageCount from './../../controller/getPageCount';
import { checkingAccess , checkingLogin } from './../../controller/getAccess';
import setLog from './../../controller/setLog';

let R = router();

R.use(checkingLogin())
/**
 * 3.商品管理相关
 */


//标签管理
R.get('/', checkingAccess('tagManage-view'), function*(next) {
  let query = this.request.query;
  let count = yield tagModel.count({});
  let fetch = yield tagModel.fetch(query.page,query.limit);
  let ranking = yield tagModel.ranking(5);
  yield render('tagsManage', {
    title: '标签统计',
    desc: '',
    page: getPageCount(count,query.page,query.limit),
    tagList: JSON.stringify(fetch),
    ranking: JSON.stringify(ranking)
  }, this);
});

export default R;
