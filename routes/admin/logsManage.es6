import router from 'koa-router';
import render from './../../utils/render';
import logModel from './../../models/Logs';
import getPageCount from './../../controller/getPageCount';
import check from './../../controller/getAccess';

let R = router();

R.use(check.login());
/**
 * 日志管理相关
 */

//日志管理
R.get('/', check.access('logsManage-view'), function*(next) {
  let query = this.request.query;
  //查询条件
  let regex = new RegExp(query.search,'i');
  let search = query.search ? {$or:[{type:{$regex:regex}},{'content':{$regex:regex}}]} : {};

  let count = yield logModel.count(search);
  let fetch = yield logModel.fetch(query.page,query.limit,search);
  yield render('logsManage', {
    title: '日志查询',
    desc: '',
    page: getPageCount(count,query.page,query.limit),
    logsList: JSON.stringify(fetch)
  }, this);
});

export default R;
