import router from 'koa-router';
import render from './../../utils/render';
import _ from 'underscore';
import crypto from 'crypto';
import categoryModel from './../../models/Categories';
import { checkingAccess , checkingLogin } from './../../controller/getAccess';

let R = router();

R.use(checkingLogin)
/**
 * 3.栏目管理相关
 */

//标签管理
R.get('/', checkingAccess('categoriesManage-view'), function*(next) {
  let fetch = yield categoryModel.fetch();
  yield render('tagsManage', {
    title: '标签统计',
    desc: '',
    categoriesList: JSON.stringify(fetch)
  }, this);
});

export default R;
