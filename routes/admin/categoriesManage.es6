import router from 'koa-router';
import render from './../../utils/render';
import _ from 'underscore';
import crypto from 'crypto';
import categoryModel from './../../models/Categories';
import { checkingAccess , checkingLogin } from './../../controller/getAccess';
import cf from './../../controller/categoryFactory';
import setLog from './../../controller/setLog';

let R = router();

R.use(checkingLogin)
/**
 * 3.栏目管理相关
 */

//标签管理
R.get('/', checkingAccess('categoriesManage-view'), function*(next) {
  //日志记录
  setLog('查看','查看栏目管理',this);
  let fetch = yield categoryModel.fetch();
  yield render('categoriesManage', {
    title: '栏目管理',
    desc: '',
    categoriesList: JSON.stringify(cf.construct(fetch))
  }, this);
});

R.post('/updateCategory', checkingAccess('categoriesManage-update'), function*(next) {
	let parm = this.request.body;
	let arr = cf.parse(parm.data);
	for (let i = 0,len = arr.length; i < len; i++) {
		let category = yield categoryModel.findById(arr[i]._id);
	  if (category.length <= 0) {
	    //新增
	    let user = new categoryModel({
	      name: arr[i].name,
	      alias: arr[i].alias,
	      parent: arr[i].parent,
	      level: arr[i].level
	    })
	    yield user.add()
	  } else {
	  	
	  	//修改
      let _category = _.extend(category[0], arr[i]);
      yield _category.save()
  	}
	};
	//日志记录
  setLog('更新','更新栏目列表成功',this);
	this.body = {
    status: 'SUCCESS::成功更新类目信息'
  }
});



export default R;