import mongoose from 'mongoose';
/*
*   后台操作日志记录的shcema,理论上每个路由都需要记录log
*   thistype {mongoose}
*/
let SettingSchema = new mongoose.Schema({
  content    : String,
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
SettingSchema.pre('save', function(next){
  //记录更新时间
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }else{
    this.meta.updateAt = Date.now();
  }
  next();
})
/*
 * 添加实例方法
 */
SettingSchema.method('add', function() {
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
SettingSchema.method('del', function() {
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
SettingSchema.statics = {
  fetch(page = 1,limit = 10, query = {}){
    return this.find({
        ...query
      },{
        __v:0
      })
      .populate('user',{
        password: 0,
        meta:0,
        _id:0,
        __v:0
      })
      .sort('-meta.updateAt')
      .skip((page - 1) * limit)
      .limit(limit)
      .exec()
  }
}

export default SettingSchema;
