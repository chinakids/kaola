import router from 'koa-router';
import render from './../utils/render';
import ccap from 'ccap';
import path from 'path';
import fs from 'fs';
import parse from 'co-busboy';
import check from './../controller/getAccess';
import sendMail from './../utils/mail';
import setLog from './../controller/setLog';
import goodsModel from './../models/Goods';
import articlesModel from './../models/Articles';
import userLikeModel from './../models/UserLike';


let securityCode = ccap({
  'width':214,
  'height':68,
  'offset':30,
  'fontsize':45
});

let R = router();

//验证码
R.get('/securityCode',function *(next) {
  let [ str , buffer ] = securityCode.get();
  this.session.ccap = str;
  this.body = buffer;
});

//上传图片,目前只做单张上传
R.post('/uploadImg', check.login(), function *(next) {
  // multipart upload
  let parts = parse(this, {
    autoFields:true
  });
  let part;
  if (part = yield parts) {
    if(part.mimeType.split('/')[0] === 'image'){
      let tmp = Date.parse(new Date()) + Math.random().toString().substr(0,10) + path.extname(part.filename);
      let stream = fs.createWriteStream(path.join(process.cwd() + '/.tmp', tmp));
      part.pipe(stream);
      this.body = {
        status: 'SUCCESS::上传成功',
        tmp : tmp
      }
    }else{
      this.body = {
        status: 'FAIL::本接口只可上传图片'
      }
    }
  }else{
    this.body = {
      status: 'FAIL::接口出错'
    }
  }
});

//删除缓存
R.post('/delImgTmp', check.login(), function *(next) {
  let query = this.request.query;
  if(fs.existsSync(path.join(process.cwd() + '/.tmp', query.url))) fs.unlinkSync(path.join(process.cwd() + '/.tmp', query.url));
  this.body = {
    status: 'SUCCESS::删除成功'
  }
});

//清空缓存
R.post('/clearImgTmp', check.login(),check.access('filesManage-del'), function *(next) {
  //递归删除非今天的缓存
  let dir = process.cwd()+'/.tmp';
  let date = new Date();
  let time = Date.parse(new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`))
  fs.readdirSync(dir).forEach((item) => {
    if(!fs.statSync(dir + '/' + item).isDirectory()){
      if(parseInt(item.split('.')[0])/10 < time){
        fs.unlinkSync(dir + '/' + item);
      }
    };
  });
  this.body = {
    status: 'SUCCESS::清空缓存成功'
  }
});

//下载文件
R.get('/download',function *(next) {
  let query = this.request.query;
  let buffer = fs.readFileSync(process.cwd()+'/public'+query.url, ['utf-8']);
  this.attachment(query.url.split('/').pop())
  this.body = buffer;
});

//发送邮件
R.post('/sendMail', check.login(), check.access('sendMail'), function *(next) {
  let parm = this.request.body;
  yield sendMail(parm);
  setLog('邮件',`发送邮件:${JSON.stringify(parm)}`,this)
  this.body = {
    status: 'SUCCESS::邮件发送成功'
  }
});

//获取权限模型
R.post('/getPowerList',check.login(),check.isAdmin(),function *(next){
  const powerList = [
    {id: 'goodsManage',pId: 0,name: '商品管理',open: true},
    {id: 'goodsManage-add',pId: 'goodsManage',name: '新增'},
    {id: 'goodsManage-view',pId: 'goodsManage',name: '查看'},
    {id: 'goodsManage-edit',pId: 'goodsManage',name: '修改'},
    {id: 'goodsManage-del',pId: 'goodsManage',name: '删除'},
    {id: 'articlesManage',pId: 0,name: '文章管理',open: true},
    {id: 'articlesManage-add',pId: 'articlesManage',name: '新增'},
    {id: 'articlesManage-view',pId: 'articlesManage',name: '查看'},
    {id: 'articlesManage-edit',pId: 'articlesManage',name: '修改'},
    {id: 'articlesManage-del',pId: 'articlesManage',name: '删除'},
    {id: 'tagsManage',pId: 0,name: '标签管理',open: true},
    {id: 'tagsManage-view',pId: 'tagsManage',name: '查看'},
    {id: 'categoriesManage',pId: 0,name: '分类管理',open: true},
    {id: 'categoriesManage-view',pId: 'categoriesManage',name: '更新'},
    {id: 'usersManage',pId: 0,name: '用户管理',open: true},
    {id: 'usersManage-add',pId: 'usersManage',name: '新增'},
    {id: 'usersManage-view',pId: 'usersManage',name: '查看'},
    {id: 'usersManage-edit',pId: 'usersManage',name: '修改'},
    {id: 'usersManage-del',pId: 'usersManage',name: '删除'},
    {id: 'systemManage',pId: 0,name: '系统管理',open: true},
    {id: 'adminManage',pId: 'systemManage',name: '系统用户管理',open: true},
    {id: 'adminManage-add',pId: 'adminManage',name: '新增'},
    {id: 'adminManage-view',pId: 'adminManage',name: '查看'},
    {id: 'adminManage-edit',pId: 'adminManage',name: '修改'},
    {id: 'adminManage-del',pId: 'adminManage',name: '删除'},
    {id: 'groupManage',pId: 'systemManage',name: '权限组管理',open: true},
    {id: 'groupManage-add',pId: 'groupManage',name: '新增'},
    {id: 'groupManage-view',pId: 'groupManage',name: '查看'},
    {id: 'groupManage-edit',pId: 'groupManage',name: '修改'},
    {id: 'groupManage-del',pId: 'groupManage',name: '删除'},
    {id: 'filesManage',pId: 'systemManage',name: '文件管理',open: true},
    {id: 'filesManage-view',pId: 'filesManage',name: '查看'},
    {id: 'filesManage-del',pId: 'filesManage',name: '删除'},
    {id: 'dataManage',pId: 'systemManage',name: '数据管理',open: true},
    {id: 'backupsMange',pId: 'dataManage',name: '备份管理',open: true},
    {id: 'backupsMange-add',pId: 'backupsMange',name: '备份'},
    {id: 'backupsMange-del',pId: 'backupsMange',name: '删除'},
    {id: 'backupsMange-re',pId: 'backupsMange',name: '恢复'},
    {id: 'logManage',pId: 'systemManage',name: '日志管理',open: true},
    {id: 'logManage-view',pId: 'logManage',name: '查看'},
    {id: 'sendMail',pId: 'systemManage',name: '发送系统邮件'}
  ]
  this.body = {
    status: 'SUCCESS::获取权限模型成功',
    data: powerList
  }
})


//喜欢
R.post('/addLike', check.login(), function *(next) {
  let query = this.request.query;
  if(query.type === 'good'){
    let [ good ] = yield goodsModel.findById(query.id);
    if(good){
      let [ userLike ] = yield userLikeModel.findByGood(query.id, this.session.userInfo._id);
      if(userLike){
        //取消喜欢
        yield userLike.del();
        let _good = Object.assign(good, {statistics:{like:good.statistics.like - 1}});
        yield _good.save();
        this.body = {
          status: 'SUCCESS::取消喜欢成功',
          data:_good.statistics.like
        }
      }else{
        let _userLike = new userLikeModel({
          good : query.id,
          user : this.session.userInfo._id
        })
        yield _userLike.save();
        let _good = Object.assign(good, {statistics:{like:good.statistics.like + 1}});
        yield _good.save();
        this.body = {
          status: 'SUCCESS::喜欢成功',
          data:_good.statistics.like
        }
      }
    }else{
      this.body = {
        status: 'FAIL::商品不存在'
      }
    }
  }else if(query.type === 'article'){
    let [ article ] = yield articlesModel.findById(query.id);
    if(article){
      let [ userLike ] = yield userLikeModel.findByArticle(query.id, this.session.userInfo._id);
      if(userLike){
        //取消喜欢
        yield userLike.del();
        let _article = Object.assign(article, {statistics:{like:article.statistics.like - 1}});
        yield _article.save();
        this.body = {
          status: 'SUCCESS::取消喜欢成功',
          data:_article.statistics.like
        }
      }else{
        let _userLike = new userLikeModel({
          article : query.id,
          user : this.session.userInfo._id
        })
        yield _userLike.save();
        let _article = Object.assign(article, {statistics:{like:article.statistics.like + 1}});
        yield _article.save();
        this.body = {
          status: 'SUCCESS::喜欢成功',
          data:_article.statistics.like
        }
      }
    }else{
      this.body = {
        status: 'FAIL::文章不存在'
      }
    }
  }else{
    this.body = {
      status: 'FAIL::需要传递类型'
    }
  }
});

export default R;
