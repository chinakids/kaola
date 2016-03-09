import mongoose from 'mongoose';
/*
*   用户喜欢数据的shcema
*   thistype {mongoose}
*/
let UserLikeSchema = new mongoose.Schema({
  good      : {
    type: String,
    ref: 'Goods'
  },
  article   : {
    type: String,
    ref: 'Articles'
  },
  user   : {
    type: String,
    ref: 'Users'
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
* 添加实例方法
*/
UserLikeSchema.method('add',function() {
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
UserLikeSchema.method('del',function() {
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
UserLikeSchema.pre('save', function(next){
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
UserLikeSchema.statics = {
  fetch(){
    return this.find({})
      .sort('-meta.createAt')
      .exec()
  },
  findByGood(id){
    return this.find({
        good:id
      })
      .populate('user')
      .sort('-meta.createAt')
      .exec()
  },
  findByUser(id){
    return this.find({
        user:id
      })
      .populate('good')
      .populate('article')
      .sort('-meta.createAt')
      .exec()
  },
  findByArticle(id){
    return this.find({
        article:id
      })
      .populate('user')
      .sort('-meta.createAt')
      .exec()
  }
}
export default UserLikeSchema;
