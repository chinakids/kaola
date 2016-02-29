import router from 'koa-router';
import render from './../../utils/render';
import _ from 'underscore';
import crypto from 'crypto';
import tagModel from './../../models/Tags';
import getPageCount from './../../controller/getPageCount';
import { checkingAccess , checkingLogin } from './../../controller/getAccess';
import setLog from './../../controller/setLog';

let R = router();

R.use(checkingLogin)
/**
 * 3.商品管理相关
 */


//标签管理
R.get('/', checkingAccess('tagManage-view'), function*(next) {
  //日志记录
  setLog('查看','查看标签统计数据',this);
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
