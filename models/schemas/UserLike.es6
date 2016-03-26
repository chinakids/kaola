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
    return this.find({},{
        __v:0
      })
      .sort('-meta.createAt')
      .exec()
  },
  findByGood(id, userId){
    return this.find({
        good:id,
        user:userId
      },{
        __v:0
      })
      .populate('user',{
        password: 0,
        meta:0,
        phoneNum:0,
        email:0,
        _id:0,
        __v:0,
        group:0
      })
      .sort('-meta.createAt')
      .exec()
  },
  findByArticle(id, userId){
    return this.find({
        article:id,
        user:userId
      },{
        __v:0
      })
      .populate('user',{
        password: 0,
        meta:0,
        phoneNum:0,
        email:0,
        _id:0,
        __v:0,
        group:0
      })
      .sort('-meta.createAt')
      .exec()
  }
}
export default UserLikeSchema;
