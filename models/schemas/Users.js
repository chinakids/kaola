import mongoose from 'mongoose';

import UserGroup from '../UserGroup'
/*
*   创建用户的shcema
*   thistype {mongoose}
*/
UserSchema = new mongoose.Schema({
  name       : String,
  userName   : String,
  password   : String,
  email      : String,
  phoneNum   : Number,
  admin      : Boolean,
  logo: {
    type: String,
    default: "/upload/images/defaultlogo.png"
  },
  group: {
    type: String,
    ref: 'UserGroup'
  }
  meta       :
    createAt :
      type      : Date,
      default   : Date.now()
    updateAt :
      type      : Date,
      default   : Date.now()
});
/*
*   给save方法添加预处理
*/
UserSchema.pre('save', (next) ->
  //记录更新时间
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }else{
    this.meta.updateAt = Date.now();
  }
  next();
)
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

exports default UserSchema;
