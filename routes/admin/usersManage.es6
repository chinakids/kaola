import router from 'koa-router';
import render from './../../utils/render';
import _ from 'underscore';
import crypto from 'crypto';
import usersModel from './../../models/Users';
import userGroupModel from './../../models/UserGroup';
import getPageCount from './../../controller/getPageCount';
import getAccess from './../../controller/getAccess';

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
 * 会员管理相关
 */
//会员管理
R.get('/', getAccess('usersManage-view'), function*(next) {
  let count = yield usersModel.count({});
  let userFetch = yield usersModel.findUser();
  yield render('usersManage', {
    title: '会员管理',
    desc: '',
    page: JSON.stringify(getPageCount(count)),
    userList: JSON.stringify(userFetch)
  }, this);
});
//会员管理 - 增加
R.post('/addUser', getAccess('usersManage-add'), function*(next) {
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
    this.body = {
      status: 'SUCCESS::成功增加会员账号'
    }
  }
});
//会员管理 - 修改
R.post('/editUser', getAccess('usersManage-edit'), function*(next) {
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
      //合并
      let _user = _.extend(user[0], parm);
      yield _user.save()
      this.body = {
        status: 'SUCCESS::成功修改会员账号'
      }
    }
  }
});
//会员管理 - 删除
R.post('/delUser', getAccess('usersManage-del'), function*(next) {
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
      this.body = {
        status: 'SUCCESS::成功删除会员账号'
      }
    }
  }
});


export default R;
