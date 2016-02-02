import mongoose from 'mongoose';
/*
*   后台操作日志记录的shcema
*   thistype {mongoose}
*/
let LogSchema = new mongoose.Schema({
  type       : String,//类型
  message    : String,//内容
  level      : {
    type     : String,
    default  : 'p4' //p4-p1等级危险程度依次递增，后期操作记录会进行记录
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
*   绑定静态方法
*   thistype {Object}
*/
LogSchema.statics = {
  fetch(cb){
    this.find({})
      .sort('meta.updateAt')
      .exec(cb)
  }
}

export default LogSchema;
