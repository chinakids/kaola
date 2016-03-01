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
 * 会员管理相关
 */
//会员管理
R.get('/', check.access('usersManage-view'), function*(next) {
  let query = this.request.query;
  let count = yield usersModel.count({});
  let userFetch = yield usersModel.findUser(query.page,query.limit);
  yield render('usersManage', {
    title: '会员管理',
    desc: '',
    page: getPageCount(count,query.page,query.limit),
    userList: JSON.stringify(userFetch)
  }, this);
});
//会员管理 - 增加
R.post('/addUser', check.access('usersManage-add'), function*(next) {
  let parm = this.request.body;
  let md5 = crypto.createHash('md5');
  let checking = yield usersModel.findUserByEmail(parm.email);
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
      admin: false,
      group: 'activated' //从后台添加的默认为激活账户
    })
    yield user.add()
    //日志记录
    setLog('新增',`新增用户(email:${parm.email})成功`,this);
    this.body = {
      status: 'SUCCESS::成功增加会员账号'
    }
  }
});
//会员管理 - 修改
R.post('/editUser', check.access('usersManage-edit'), function*(next) {
  let parm = this.request.body;
  let md5 = crypto.createHash('md5');
  let user = yield usersModel.findUserById(parm._id);
  if (user.length <= 0) {
    this.body = {
      status: 'FAIL::该账号不存在'
    }
  } else {
    if (user[0].group.power === 'root') {
      this.body = {
        status: 'FAIL::Root权限账号无法修改'
      }
    } else {
      if(parm.password){
        //加密
        parm.password = md5.update(parm.password).digest('hex')
      }
      //用户信息禁止修改邮件地址
      if(parm.email){
        delete parm.email;
      }
      //合并
      let _user = Object.assign(user[0], parm);
      yield _user.save()
      //日志记录
      setLog('修改',`修改用户(email:${_user.email})成功`,this);
      this.body = {
        status: 'SUCCESS::成功修改会员账号'
      }
    }
  }
});
//会员管理 - 删除
R.post('/delUser', check.access('usersManage-del'), function*(next) {
  let parm = this.request.body;
  let user = yield usersModel.findUserById(parm._id);
  if (user.length <= 0) {
    this.body = {
      status: 'FAIL::该账号不存在'
    }
  } else {
    if (user[0].group.power === 'root') {
      this.body = {
        status: 'FAIL::Root权限账号无法删除'
      }
    } else {
      yield user[0].del()
      //日志记录
      setLog('删除',`删除用户(email:${user[0].email})成功`,this);
      this.body = {
        status: 'SUCCESS::成功删除会员账号'
      }
    }
  }
});


export default R;
