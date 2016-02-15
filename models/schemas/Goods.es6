/**
 * Created by xuanyong on 16/2/14.
 *   商品的shcema
 */
import mongoose from 'mongoose';

let GoodSchema = new mongoose.Schema({
    title      : String, //标题
    content    : String, //内容markdown格式
    price      : Number, //价格
    info       : {
        location : String,//位置
        callType : {
            type: Number,
            default: 0
        },//联系方式
        callWay  : String//联系数据
    },
    imgList    : String,//图片
    //category: {
    //    type     : String,
    //    ref      : 'Category'
    //}, //文章类别
    tag        : String, //标签
    author     : {
        type     : String,
        ref      : 'Users'
    },
    state      : {
        display  : {
            type     : Boolean,
            default  : true,
        },//是否显示
        top      : {
            type     : Boolean,
            default  : false,
        },//是否置顶
        sell     : {
            type     : Boolean,
            default  : false,
        }//售出状态
    },
    statistics : {
        like     : {
            type     : Number,
            default  : 0,
        }, //喜欢
        view     : {
            type     : Number,
            default  : 0,
        }, //查看
        comment  : {
            type     : Number,
            default  : 0,
        } //回复
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
GoodSchema.pre('save', function(next){
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
GoodSchema.method('add',function() {
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
GoodSchema.method('del',function() {
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
GoodSchema.statics = {
    fetch(){
        return this.find({})
            .populate('author')
            .sort('meta.updateAt')
            .exec()
    }
}

export default GoodSchema;
