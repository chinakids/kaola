import mongoose from 'mongoose';
/*
 *   Tag的shcema
 */
let CategoriesSchema = new mongoose.Schema({
  name: String, //名称
  level: Number, //排序
  alias: String, //别名
  parent: {
    type: String,
    default: 'root' //默认顶层栏目,存储别名
  },
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
CategoriesSchema.pre('save', function(next) {
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
CategoriesSchema.method('add', function() {
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
CategoriesSchema.method('del', function() {
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
CategoriesSchema.statics = {
  fetch(cb) {
    return this.find({}, {
        __v: 0,
        meta: 0,
        _id: 0
      })
      .sort('level')
      .exec()
  },
  findByAlias(alias) {
    return this.find({
        alias: alias
      })
      .sort('level')
      .exec()
  }
}

export default CategoriesSchema;