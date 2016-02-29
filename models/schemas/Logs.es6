import mongoose from 'mongoose';
/*
*   后台操作日志记录的shcema,理论上每个路由都需要记录log
*   thistype {mongoose}
*/
let LogSchema = new mongoose.Schema({
  type       : String,//类型
  content    : String,//内容
  level      : {
    type     : Number,
    default  : 4 //4-1等级危险程度依次递增，后期操作记录会进行记录
  },//等级
  user       : {
    type     : String,
    ref      : 'Users'
  },//产生行为的用户
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
LogSchema.pre('save', function(next){
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
LogSchema.method('add', function() {
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
LogSchema.method('del', function() {
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
LogSchema.statics = {
  fetch(cb){
    return this.find({})
      .populate('user')
      .sort('-meta.updateAt')
      .exec(cb)
  }
}

export default LogSchema;
