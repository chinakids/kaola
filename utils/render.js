import jadeRuntime from 'jade/runtime';
import templateModel from './../models/Template';
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
  let path = self.request.path === undefined ? '' : self.request.path;
  //根据path设置group
  if(path.split('/')[1] === S.ADMIN_DOMAIN && name != 'error'){
    group = 'backend';
    //填充其他数据
    data.pageInfo = {
      'path'        : path,
      'adminDomain' : S.ADMIN_DOMAIN
    }
    data.userInfo = self.session.userInfo || {};
  }else{
    //填充其他数据
    data.pageInfo = {
      'path'        : path
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
    yield self.render(group+'/'+name, data);
  }else {
    let promise = new Promise((resolve, reject) => {
      templateModel.findByName({'name':name,'group':group}, (err,templates) => {
        if(err){
          logger('model',err);
          reject(err)
        }else{
          let templateJS= new Function('jade','data',templates[0].content+';return template(data)');
          resolve(templateJS(jadeRuntime,data));
        };
      });
    });
    yield promise.then((html) => {
      self.body = html;
    },(err) => {
      logger('error',err);
    });
  }
}

export default render;
