import mongoose from 'mongoose';
/*
 *   上传文件记录的shcema
 *   thistype {mongoose}
 */
let UploadFileSchema = new mongoose.Schema({
  name: String, //名称
  url: String, //对应资源地址
  mimeType: String, //种类
  type: String, //位置
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

/*
 *   给save方法添加预处理
 */
UploadFileSchema.pre('save', function(next) {
  //记录更新时间
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
})
/*
 * 添加实例方法
 */
UploadFileSchema.method('add', function() {
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
UploadFileSchema.method('del', function() {
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
UploadFileSchema.statics = {
  fetch(page = 1, limit = 10 , query = {type : 'goods'}) {
    return this.find(query,{
        _v:0  
      })
      .sort('-meta.createAt')
      .skip((page - 1) * limit)
      .limit(limit)
      .exec()
  },
  findById(id) {
    if (id) {
      return this.find({
          _id: id
        })
        .sort('meta.updateAt')
        .exec()
    } else {
      return []
    }
  }
}

export default UploadFileSchema;