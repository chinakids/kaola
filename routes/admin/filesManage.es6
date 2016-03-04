import router from 'koa-router';
import render from './../../utils/render';
import fs from 'fs';
import getPageCount from './../../controller/getPageCount';
import check from './../../controller/getAccess';
import uploadFileModel from './../../models/UploadFiles';


let R = router();

R.use(check.login());
/**
 * 日志管理相关
 */

//日志管理
R.get('/', check.access('filesManage-view'), function*(next) {
  let query = this.request.query;
  let count = yield uploadFileModel.count({});
  //查询条件
  let search = query.type ? {type:query.type} : {};
  let filesFetch = yield uploadFileModel.fetch(query.page,query.limit,search);
  let dir = process.cwd()+'/.tmp';
  let cacheSize = 0;
  fs.readdirSync(dir).forEach((item) => {
    let i = fs.statSync(dir + '/' + item);
    if(!i.isDirectory()){
      cacheSize += i.size;
    };
  });
  //获取缓存大小
  if(query.type && query.type === 'goods'){
    yield render('filesManage', {
      title: '资源文件管理',
      desc: '',
      type: 'goods',
      cacheSize: (cacheSize / (1024*1024)).toFixed(2), // 换算成两位小数MB
      page: getPageCount(count,query.page,query.limit),
      filesList: JSON.stringify(filesFetch),
    }, this);
  }else if(query.type && query.type === 'articles'){
    yield render('filesManage', {
      title: '资源文件管理',
      desc: '',
      type: 'articles',
      cacheSize: (cacheSize / (1024*1024)).toFixed(2), // 换算成两位小数MB
      page: getPageCount(count,query.page,query.limit),
      filesList: JSON.stringify(filesFetch),
    }, this);
  }else{
    this.redirect('?type=goods');
  }
});

export default R;
