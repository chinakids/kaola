import mongoose from 'mongoose';

import UserGroup from '../UserGroup';
/*
*   创建用户的shcema
*   thistype {mongoose}
*/
let UserSchema = new mongoose.Schema({
  nickName   : String,//昵称
  email      : String,//邮箱
  password   : String,//密码
  phoneNum   : String,//电话
  admin      : Boolean,//是否为管理员
  avatar     : {
    type     : String,//头像
    default  : '/avatar/avatar.jpg'
  },
  group      : {
    type     : String,//用户组
    ref      : 'UserGroup'
  },
  meta       : {
    createAt : {
      type      : Date,
      default   : Date.now()
    },
    updateAt : {
      type      : Date,
      default   : Date.now()
    }
  }
});
/*
*   给save方法添加预处理
*/
UserSchema.pre('save', function(next){
  //记录更新时间
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }else{
    this.meta.updateAt = Date.now();
  }
  next();
})
/*
*   绑定静态方法
*   thistype {Object}
*/
UserSchema.statics = {
  fetch(cb){
    this.find({},{
        password:0 //获取info时过滤掉password
      })
      .populate('group')
      .sort('meta.updateAt')
      .exec(cb)
  },
  findAdmin(cb){
    this.find({
        admin:true
      },{
        password:0 //获取info时过滤掉password
      })
      .populate('group')
      .sort('meta.updateAt')
      .exec(cb)
  },
  findUser(cb){
    this.find({
        admin:false
      },{
        password:0 //获取info时过滤掉password
      })
      .populate('group')
      .sort('meta.updateAt')
      .exec(cb)
  },
  findAdminById(id,cb){
    this.find({
        _id:id
      })
      .populate('group')
      .sort('meta.updateAt')
      .exec(cb)
  },
  findAdminByEmail(email,cb){
    this.find({
        email:email
      })
      .populate('group')
      .sort('meta.updateAt')
      .exec(cb)
  },
  findUserById(id,cb){
    this.find({
        _id:id
      })
      .populate('group')
      .sort('meta.updateAt')
      .exec(cb)
  },
  findUserByEmail(email,cb){
    this.find({
        email:email
      })
      .populate('group')
      .sort('meta.updateAt')
      .exec(cb)
  },
  getInfoByEmail(email,cb){
    this.find({
        email:email
      },{
        password:0 //获取info时过滤掉password
      })
      .populate('group')
      .sort('meta.updateAt')
      .exec(cb)
  }
}

export default UserSchema;
