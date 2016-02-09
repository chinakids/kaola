import router from 'koa-router';
import render from './../../utils/render';
import _ from 'underscore';
import crypto from 'crypto';
import usersModel from './../../models/Users';
import userGroupModel from './../../models/UserGroup';
import getPageCount from './../../controller/getPageCount';

let R = router();

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

/**
 * 4.系统管理相关
 */
//管理员管理
R.get('/', function*(next) {
  //if (getAccess('adminManage-view')) {
  let count = yield usersModel.count({});
  let userFetch = yield usersModel.findAdmin();
  let groupFetch = yield userGroupModel.fetch();
  yield render('adminManage', {
    title: '系统用户管理',
    desc: '',
    page: JSON.stringify(getPageCount(count)),
    adminList: JSON.stringify(userFetch),
    groupList: JSON.stringify(groupFetch)
  }, this);
  // } else {
  //   this.body = {
  //     status: 'FAIL::没有操作权限'
  //   }
  // }
});
//管理员管理 - 增加
R.post('/addAdmin', function*(next) {
  //if (getAccess('adminManage-add')) {
  let parm = this.request.body;
  let md5 = crypto.createHash('md5');
  let checking = yield usersModel.findAdminByEmail(parm.email);
  if (checking.length > 0) {
    this.body = {
      status: 'FAIL::该邮箱已存在'
    }
  } else {
    let user = new usersModel({
      nickName: parm.nickName,
      email: parm.email,
      password: md5.update(parm.password).digest('hex'),
      phoneNum: parm.phoneNum,
      admin: true,
      group: parm.group
    })
    yield user.add()
    this.body = {
      status: 'SUCCESS::成功增加管理员账号'
    }
  }
  // } else {
  //   this.body = {
  //     status: 'FAIL::没有操作权限'
  //   }
  // }
});
//管理员管理 - 修改
R.post('/editAdmin', function*(next) {
  //if (getAccess('adminManage-edit')) {
  let parm = this.request.body;
  let md5 = crypto.createHash('md5');
  let admin = yield usersModel.findAdminById(parm._id);
  if (admin.length <= 0) {
    this.body = {
      status: 'FAIL::该账号不存在'
    }
  } else {
    if (admin[0].group.power === 'root') {
      this.body = {
        status: 'FAIL::Root权限账号无法修改'
      }
    } else {
      //加密
      parm.password = md5.update(parm.password).digest('hex')
        //合并
      let _admin = _.extend(admin[0], parm);
      yield _admin.save()
      this.body = {
        status: 'SUCCESS::成功修改管理员账号'
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
R.post('/delAdmin', function*(next) {
  //if (getAccess('adminManage-del')) {
  let parm = this.request.body;
  let admin = yield usersModel.findAdminById(parm._id);
  if (admin.length <= 0) {
    this.body = {
      status: 'FAIL::该账号不存在'
    }
  } else {
    if (admin[0].group.power === 'root') {
      this.body = {
        status: 'FAIL::Root权限账号无法删除'
      }
    } else {
      yield admin[0].del()
      this.body = {
        status: 'SUCCESS::成功删除管理员账号'
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
