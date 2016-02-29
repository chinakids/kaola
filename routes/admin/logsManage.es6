import router from 'koa-router';
import render from './../../utils/render';
import _ from 'underscore';
import crypto from 'crypto';
import logModel from './../../models/Logs';
import getPageCount from './../../controller/getPageCount';
import { checkingAccess , checkingLogin } from './../../controller/getAccess';
import setLog from './../../controller/setLog';

let R = router();

R.use(checkingLogin);
/**
 * 日志管理相关
 */

//日志管理
R.get('/', checkingAccess('logsManage-view'), function*(next) {
  //日志记录
  setLog('查看','查看系统日志',this);
  let count = yield logModel.count({});
  let fetch = yield logModel.fetch();
  yield render('logsManage', {
    title: '日志查询',
    desc: '',
    page: JSON.stringify(getPageCount(count)),
    logsList: JSON.stringify(fetch)
  }, this);
});

export default R;