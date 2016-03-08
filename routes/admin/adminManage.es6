import router from 'koa-router';
import render from './../../utils/render';
import crypto from 'crypto';
import usersModel from './../../models/Users';
import userGroupModel from './../../models/UserGroup';
import getPageCount from './../../controller/getPageCount';
import check from './../../controller/getAccess';
import setLog from './../../controller/setLog';

let R = router();

R.use(check.login())

/**
 * 系统管理相关
 */
//管理员管理
R.get('/', check.access('adminManage-view'), function*(next) {
  let query = this.request.query;
  //查询条件
  let regex = new RegExp(query.search,'i');
  let search = query.search ? {$or:[{nickName:{$regex:regex}},{email:{$regex:regex}},{phone:{$regex:regex}}]} : {};

  let count = yield usersModel.count(search);
  let userFetch = yield usersModel.findAdmin(query.page,query.limit,search);
  let groupFetch = yield userGroupModel.fetch();
  yield render('adminManage', {
    title: '系统用户管理',
    desc: '',
    page: getPageCount(count,query.page,query.limit),
    adminList: JSON.stringify(userFetch),
    groupList: JSON.stringify(groupFetch)
  }, this);
});
//管理员管理 - 增加
R.post('/addAdmin', check.access('adminManage-add'), function*(next) {
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
    //日志记录
    setLog('新增',`新增系统管理员(email:${parm.email})成功`,this);
    this.body = {
      status: 'SUCCESS::成功增加管理员账号'
    }
  }
});
//管理员管理 - 修改
R.post('/editAdmin', check.access('adminManage-edit'), function*(next) {
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
      if(parm.password){
        //加密
        parm.password = md5.update(parm.password).digest('hex')
      }
      //合并
      let _admin = Object.assign(admin[0], parm);
      yield _admin.save()
      //日志记录
      setLog('修改',`修改系统管理员(email:${parm.email})成功`,this);
      this.body = {
        status: 'SUCCESS::成功修改管理员账号'
      }
    }
  }
});
//管理员管理 - 删除
R.post('/delAdmin', check.access('adminManage-del'), function*(next) {
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
      //日志记录
      setLog('删除',`删除系统管理员(email:${admin[0].email})成功`,this);
      this.body = {
        status: 'SUCCESS::成功删除管理员账号'
      }
    }
  }
});


export default R;
