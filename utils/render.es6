import jadeRuntime from 'jade/runtime';
import templateModel from './../models/Template';
import fs from 'fs';
import path from 'path';
import logger from './logger';
import S from './../conf/setting';
/**
 * [render 返回页面的方法]
 * @param  {[type]} name [模板名称]
 * @param  {[type]} source [填充的数据]
 * @param  {[type]} ctx  [执行上下文]
 * [eg.Router中调用方法]
 * 1.  rander('index',{...},this);
 * 2.  rander.call(this,'index',{...});
 */
function * render(name, source ,ctx){
  let self = ctx || this;
  let group = 'fontend';
  let data = source;
  let urlPath = self.request.path === undefined ? '' : self.request.path;
  //根据path设置group
  if(urlPath.split('/')[1] === S.ADMIN_DOMAIN && name != 'error'){
    group = 'backend';
    //填充其他数据
    data.pageInfo = {
      'path'        : urlPath,
      'adminDomain' : S.ADMIN_DOMAIN
    }
    data.userInfo = self.session.userInfo || {};
  }else{
    //填充其他数据
    data.pageInfo = {
      'path'        : urlPath
    }
    data.userInfo = self.session.userInfo || {};
  }
  data.siteInfo = {
    title   : S.SITE_TITLE,
    domain  : S.SITE_DOMAIN,
    mail    : S.SITE_MAIL,
    icp     : S.SITE_ICP,
    version : S.SITE_VERSION,
    desc    : S.SITE_DISCRIPTION,
    keywords: S.SITE_KEYWORDS,
    basicKW : S.SITE_BASICKEYWORDS
  }
  //DEBUG模式下不使用缓存
  if(S.DEBUG){
    yield self.render(`${group}/${name}`, data);
  }else {
    let cacheContent = fs.readFileSync(path.join(__dirname, `./../views/.cache/${group}/${name}.cache`),'utf-8');
    let templateJS = new Function('jade','data',`${cacheContent};return template(data)`);
    self.body = templateJS(jadeRuntime,data);
  }
}

export default render;
