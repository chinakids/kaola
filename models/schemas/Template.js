import mongoose from 'mongoose';
/*
*   模板缓存的shcema
*   thistype {mongoose}
*/
let TemplateSchema = new mongoose.Schema({
  name       : String,//名称
  group      : String,//所属组
  content    : String,//内容
  compiled   : {
    type     : Number,//二次编译次数
    default  : 0
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
TemplateSchema.pre('save', function(next){
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
TemplateSchema.statics = {
  fetch(cb){
    this.find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findByName(query,cb){
    this.find({
        name:query.name,
        group:query.group
      })
      .sort('meta.updateAt')
      .exec(cb)
  }
}

export default TemplateSchema;
