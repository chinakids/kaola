import mongoose from 'mongoose';
/*
*   Tag的shcema
*/
let TagsSchema = new mongoose.Schema({
  name       : String,//名称
  count      : {
    type     : Number,
    default  : 0  //TODO 这里还没考虑编辑造成的重复统计,在edit的时候做个diff去掉已经存在的
  },//数量
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
TagsSchema.pre('save', function(next){
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
TagsSchema.method('add',function() {
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
TagsSchema.method('del',function() {
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
*   绑定静态方法
*   thistype {Object}
*/
TagsSchema.statics = {
  fetch(cb){
    return this.find({})
      .sort('meta.updateAt')
      .exec()
  },
  findByName(name){
    return this.find({
        name:name
      })
      .sort('meta.updateAt')
      .exec()
  }
}

export default TagsSchema;
