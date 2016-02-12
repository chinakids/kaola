import router from 'koa-router';
import render from './../../utils/render';
import _ from 'underscore';
import crypto from 'crypto';
import userGroupModel from './../../models/UserGroup';
import getPageCount from './../../controller/getPageCount';
import getAccess from './../../controller/getAccess';

let R = router();
/**
 * 3.商品管理相关
 */

R.use(function*(next) {
  if(this.session.login){
    yield next;
  }else{
    if(this.request.method === 'GET'){
      this.redirect('./login')
    }else{
      this.body = {
        status: 'FAIL::该接口需要登录'
      }
    }
  }
})

//权限组管理
R.get('/', getAccess('groupManage-view'), function*(next) {
    //if (getAccess('groupManage-view')) {
  let count = yield userGroupModel.count({});
  let fetch = yield userGroupModel.fetch();
  yield render('groupManage', {
    title: '权限组管理',
    desc: '',
    page: JSON.stringify(getPageCount(count)),
    groupList: JSON.stringify(fetch)
  }, this);
  // } else {
  //   //TODO
  //   this.body = {
  //     status: 'FAIL::没有操作权限'
  //   }
  // }
});
//管理员管理 - 增加
R.post('/addGroup', getAccess('groupManage-add'), function*(next) {
  //if (getAccess('groupManage-add')) {
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
    this.body = {
      status: 'SUCCESS::成功增加权限组'
    }
  }
  // } else {
  //   this.body = {
  //     status: 'FAIL::没有操作权限'
  //   }
  // }
});
//管理员管理 - 修改
R.post('/editGroup',getAccess('groupManage-edit'), function*(next) {
  //if (getAccess('groupManage-edit')) {
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
      this.body = {
        status: 'SUCCESS::成功修改权限组'
      }
    }
  }
  // } else {
  //   this.body = {
  //     status: 'FAIL::没有操作权限'
  //   }
  // }
});
//管理员管理 - 删除
R.post('/delGroup', getAccess('groupManage-del'), function*(next) {
  //if (getAccess('groupManage-del')) {
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
      this.body = {
        status: 'SUCCESS::成功删除权限组'
      }
    }
  }
  // } else {
  //   this.body = {
  //     status: 'FAIL::没有操作权限'
  //   }
  // }
});

export default R;