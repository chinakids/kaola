import router from 'koa-router';
import render from './../utils/render';
import ccap from 'ccap';
import _ from 'underscore';
import crypto from 'crypto';
import usersModel from './../models/Users';
import userGroupModel from './../models/UserGroup';
import getPageCount from './../controller/getPageCount';
import getAccess from './../controller/getAccess';
import S from './../conf/setting';

let R = router();

R.use(function*(next) {
  yield next;
})

/**
 * 0、初始化
 */

R.get('/init', function*(next) {
  if (S.NEED_INIT) {} else {
    this.redirect('./login')
  }
  //还要创建root限权
  yield render('init', {
    title: '初始化账户'
  }, this);
});

R.post('/init', function*(next) {
  if (S.NEED_INIT) {
    let parm = this.request.body;
    let md5 = crypto.createHash('md5');
    //先初始化root权限组
    let checkingGroup = yield userGroupModel.findByName('root');
    let userGroup;
    if (checkingGroup.length <= 0) {
      userGroup = new userGroupModel({
        name: 'root',
        power: 'root'
      })
      yield userGroup.add();
    } else {
      userGroup = checkingGroup[0];
    }
    let checkingUser = yield usersModel.findAdminByEmail(parm.email);
    if (checkingUser.length > 0) {
      this.body = {
        status: 'FAIL::该邮箱已存在'
      }
    } else {
      let user = new usersModel({
        nickName: parm.nickName,
        email: parm.email,
        password: md5.update(parm.password).digest('hex'),
        phoneNum: parm.phoneNum,
        group: userGroup._id,
        admin: true
      })
      yield user.add()
      this.body = {
        status: 'SUCCESS::成功增加管理员账号'
      }
    }
  } else {
    this.body = {
      status: 'FAIL::系统已关闭初始化'
    }
  }
});

/**
 * 1、登陆相关
 */

//登陆
R.get('/login', function*(next) {
  if (!this.session.login) {
    yield render('login', {
      title: '管理员登陆'
    }, this);
  } else {
    this.redirect('./')
  }
});
//登陆接口
R.post('/login', function*(next) {
  let parm = this.request.body;
  let md5 = crypto.createHash('md5');
  let result = yield usersModel.findAdminByEmail(parm.email);
  if (result.length <= 0) {
    this.body = {
      status: 'FAIL::用户不存在'
    }
  } else {
    let ticket = md5.update((result[0].password + this.session.ccap).toUpperCase()).digest('hex');
    if (parm.ticket.toUpperCase() === ticket.toUpperCase()) {
      this.session.email = parm.email;
      this.session.login = true;
      this.session.ccap = '';
      this.body = {
        status: 'SUCCESS::登陆成功'
      }
    } else {
      this.body = {
        status: 'FAIL::密码或验证码错误'
      }
    }
  }
});
//登出
R.all('/logout', function*(next) {
  if (this.request.method === 'GET') {
    this.session.login = false;
    this.session.userInfo = null;
    this.redirect('./login');
  } else if (this.request.method === 'POST') {
    this.session.login = false;
    this.session.userInfo = null;
    this.body = {
      status: 'SUCCESS::退出登陆'
    }
  } else {
    this.body = {
      status: 'FAIL::此接口不接受其他请求模式'
    }
  }
});

/**
 * 2、管理面板
 */

//控制面板
R.get('/', function*(next) {
  if (this.session.login) {
    yield render('index', {
      title: '管理面板',
      desc: '日常管理面板'
    }, this);
  } else {
    this.redirect('./login')
  }
});

/**
 * 3.商品管理相关
 */

R.get('/goodsManage', function*(next) {
  if (this.session.login) {
    //if (getAccess(this, 'goodsManage-view')) {
    yield render('goodsManage', {
      title: '商品管理',
      desc: ''
    }, this);
    // } else {
    //   //TODO
    //   this.body = {
    //     status: 'FAIL::没有操作权限'
    //   }
    // }
  } else {
    this.redirect('./login')
  }
});


/**
 * 4.系统管理相关
 */
//管理员管理
R.get('/adminManage', function*(next) {
  if (this.session.login) {
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
  } else {
    this.redirect('./login')
  }
});
//管理员管理 - 增加
R.post('/adminManage/addAdmin', function*(next) {
  if (this.session.login) {
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
  } else {
    this.body = {
      status: 'FAIL::该接口需要登录'
    }
  }
});
//管理员管理 - 修改
R.post('/adminManage/editAdmin', function*(next) {
  if (this.session.login) {
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
  } else {
    this.body = {
      status: 'FAIL::该接口需要登录'
    }
  }
});
//管理员管理 - 删除
R.post('/adminManage/delAdmin', function*(next) {
  if (this.session.login) {
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
  } else {
    this.body = {
      status: 'FAIL::该接口需要登录'
    }
  }
});
//权限组管理
R.get('/groupManage', function*(next) {
  if (this.session.login) {
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
  } else {
    this.redirect('./login')
  }
});
//管理员管理 - 增加
R.post('/groupManage/addGroup', function*(next) {
  if (this.session.login) {
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
  } else {
    this.body = {
      status: 'FAIL::该接口需要登录'
    }
  }
});
//管理员管理 - 修改
R.post('/groupManage/editGroup', function*(next) {
  if (this.session.login) {
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
  } else {
    this.body = {
      status: 'FAIL::该接口需要登录'
    }
  }
});
//管理员管理 - 删除
R.post('/groupManage/delGroup', function*(next) {
  if (this.session.login) {
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
  } else {
    this.body = {
      status: 'FAIL::该接口需要登录'
    }
  }
});

export default R;
