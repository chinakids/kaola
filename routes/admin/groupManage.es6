import router from 'koa-router';
import render from './../../utils/render';
import _ from 'underscore';
import crypto from 'crypto';
import userGroupModel from './../../models/UserGroup';
import getPageCount from './../../controller/getPageCount';
import { checkingAccess , checkingLogin } from './../../controller/getAccess';
import setLog from './../../controller/setLog';

let R = router();

R.use(checkingLogin)
/**
 * 3.商品管理相关
 */


//权限组管理
R.get('/', checkingAccess('groupManage-view'), function*(next) {
  let count = yield userGroupModel.count({});
  let fetch = yield userGroupModel.fetch();
  yield render('groupManage', {
    title: '权限组管理',
    desc: '',
    page: JSON.stringify(getPageCount(count)),
    groupList: JSON.stringify(fetch)
  }, this);
});
//管理员管理 - 增加
R.post('/addGroup', checkingAccess('groupManage-add'), function*(next) {
  //存入
  let parm = this.request.body;
  let checking = yield userGroupModel.findByName(parm.name);
  if (checking.length > 0) {
    this.body = {
      status: 'FAIL::存在该名称权限组'
    }
  } else {
    let userGroup = new userGroupModel({
      name: parm.name,
      power: parm.power
    })
    yield userGroup.add()
    //日志记录
    setLog('新增',`新增系统权限组(name:${parm.name})成功`,this);
    this.body = {
      status: 'SUCCESS::成功增加权限组'
    }
  }
});
//管理员管理 - 修改
R.post('/editGroup',checkingAccess('groupManage-edit'), function*(next) {
  let parm = this.request.body;
  let group = yield userGroupModel.findById(parm._id);
  if (group.length <= 0) {
    this.body = {
      status: 'FAIL::该权限组不存在'
    }
  } else {
    //合并
    if (group[0].power === 'root') {
      this.body = {
        status: 'FAIL::Root权限无法修改'
      }
    } else {
      let _group = _.extend(group[0], parm);
      yield _group.save()
      //日志记录
      setLog('修改',`修改系统权限组(name:${_group.name})成功`,this);
      this.body = {
        status: 'SUCCESS::成功修改权限组'
      }
    }
  }
});
//管理员管理 - 删除
R.post('/delGroup', checkingAccess('groupManage-del'), function*(next) {
  let parm = this.request.body;
  let group = yield userGroupModel.findById(parm._id);
  if (group.length <= 0) {
    this.body = {
      status: 'FAIL::该权限组不存在'
    }
  } else {
    if (group[0].power === 'root') {
      this.body = {
        status: 'FAIL::Root权限无法删除'
      }
    } else {
      yield group[0].del()
      //日志记录
      setLog('删除',`删除系统权限组(name:${group[0].name})成功`,this);
      this.body = {
        status: 'SUCCESS::成功删除权限组'
      }
    }
  }
});

export default R;
