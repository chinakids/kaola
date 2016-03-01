import router from 'koa-router';
import render from './../../utils/render';
import logModel from './../../models/Logs';
import getPageCount from './../../controller/getPageCount';
import check from './../../controller/getAccess';
import setLog from './../../controller/setLog';

let R = router();

R.use(check.login());
/**
 * 日志管理相关
 */

//日志管理
R.get('/', check.access('logsManage-view'), function*(next) {
  let query = this.request.query;
  let count = yield logModel.count({});
  let fetch = yield logModel.fetch(query.page,query.limit);
  yield render('logsManage', {
    title: '日志查询',
    desc: '',
    page: getPageCount(count,query.page,query.limit),
    logsList: JSON.stringify(fetch)
  }, this);
});

export default R;
