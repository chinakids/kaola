import mongoose from 'mongoose';
/*
*   创建用户组的shcema
*   thistype {mongoose}
*/
let UserGroupSchema = new mongoose.Schema({
  name       : String,//名称
  power      : {
    type     : String,
    default  : 'default'
  },//权限
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
* 添加实例方法
*/
UserGroupSchema.method('add',function() {
  let p = new Promise((resolve,reject) => {
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
UserGroupSchema.method('del',function() {
  let p = new Promise((resolve,reject) => {
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
*   给save方法添加预处理
*/
UserGroupSchema.pre('save', function(next){
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
UserGroupSchema.statics = {
  fetch(){
    //全部查询忽略最高权限
    return this.find({
        power:{'$ne':'root'}
      })
      .sort('meta.updateAt')
      .exec()
  },
  findByName(name){
    return this.find({
        name:name
      })
      .sort('meta.updateAt')
      .exec()
  },
  findById(id){
    return this.find({
        _id:id
      })
      .sort('meta.updateAt')
      .exec()
  }
}
export default UserGroupSchema;
