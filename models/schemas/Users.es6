import mongoose from 'mongoose';
/*
 *   创建用户的shcema
 *   thistype {mongoose}
 */
let UserSchema = new mongoose.Schema({
  nickName: String, //昵称
  email: String, //邮箱
  password: String, //密码
  phoneNum: String, //电话
  admin: Boolean, //是否为管理员
  avatar: {
    type: String, //头像
    default: '/avatar/avatar.jpg'
  },
  group: {
    type: String, //用户组,只有管理员账号才存在关联查询,普通账户只有已激活(activated)和未激活(activation)两种
    ref: 'UserGroup'
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});
/*
 *   给save方法添加预处理
 */
UserSchema.pre('save', function(next) {
    //记录更新时间
    if (this.isNew) {
      this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
      this.meta.updateAt = Date.now();
    }
    next();
  })
  /*
   * 添加实例方法
   */
UserSchema.method('add', function() {
  let p = new Promise((resolve, reject) => {
    this.save((error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(null, data);
      }
    });
  });
  return p;
});
UserSchema.method('del', function() {
  let p = new Promise((resolve, reject) => {
    this.remove((error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(null, data);
      }
    });
  });
  return p;
});
/*
 *   绑定静态方法
 *   thistype {Object}
 */
UserSchema.statics = {
  fetch() {
    return this.find({}, {
        password: 0 //获取info时过滤掉password
      })
      .populate('group')
      .sort('-meta.createAt')
      .exec()
  },
  findAdmin(page = 1,limit = 10) {
    return this.find({
        admin: true
      }, {
        password: 0 //获取info时过滤掉password
      })
      .populate('group')
      .sort('-meta.createAt')
      .skip((page - 1) * limit)
      .limit(limit)
      .exec()
  },
  findUser(page = 1,limit = 10) {
    return this.find({
        admin: false
      }, {
        password: 0 //获取info时过滤掉password
      })
      .sort('-meta.createAt')
      .skip((page - 1) * limit)
      .limit(limit)
      .exec()
  },
  getNewUsers(limit) {
    return this.find({
        admin: false
      }, {
        password: 0 //获取info时过滤掉password
      })
      .sort('-meta.createAt')
      .limit(limit)
      .exec()
  },
  findAdminById(id) {
    if(id){
      return this.find({
          _id: id
        })
        .populate('group')
        .sort('meta.updateAt')
        .exec()
    }else{
      return []
    }
  },
  findAdminByEmail(email) {
    return this.find({
        email: email
      })
      .populate('group')
      .sort('meta.updateAt')
      .exec()
  },
  findUserById(id) {
    if(id){
      return this.find({
          _id: id
        })
        .sort('meta.updateAt')
        .exec()
    }else{
      return []
    }
  },
  findUserByEmail(email) {
    return this.find({
        email: email
      })
      .sort('meta.updateAt')
      .exec()
  },
  getInfoByEmail(email) {
    return this.find({
        email: email
      }, {
        password: 0 //获取info时过滤掉password
      })
      .populate('group')
      .sort('meta.updateAt')
      .exec()
  }
}

export default UserSchema;