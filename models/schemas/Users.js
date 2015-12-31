import mongoose from 'mongoose';

import UserGroup from '../UserGroup'
/*
*   创建用户的shcema
*   thistype {mongoose}
*/
let UserSchema = new mongoose.Schema({
  name       : String,//昵称
  userName   : String,//用户名
  password   : String,//密码
  email      : String,//邮箱
  phoneNum   : Number,//电话
  admin      : Boolean,//是否为管理员
  avatar     : {
    type     : String,//头像
    default  : "/upload/images/defaultAvatar.png"
  },
  group      : {
    type     : String,//用户组
    ref      : 'UserGroup'
  },
  meta       :
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
    this.find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findBy(id,cb){
    this.find({
        _id:id
      })
      .sort('meta.updateAt')
      .exec(cb)
  },
  findByEmail(id,cb){
    this.find({
        email:id
      })
      .sort('meta.updateAt')
      .exec(cb)
  }
}

export default UserSchema;
