import mongoose from 'mongoose';
/*
*   创建用户组的shcema
*   thistype {mongoose}
*/
let UserGroupSchema = new mongoose.Schema({
  name: String,//名称
  power: String,//权限
  comments: String,//备注
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
UserGroupSchema.pre('save', (next) ->
  //记录更新时间
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }else{
    this.meta.updateAt = Date.now();
  }
  next();
)

export default UserGroupSchema;
