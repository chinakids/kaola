import jadeRuntime from 'jade/runtime';
import templateModel from './../models/Template';
import logger from './logger';
import S from './../conf/setting'
/**
 * [render 返回页面的方法]
 * @param  {[type]} name [模板名称]
 * @param  {[type]} data [填充的数据]
 * @param  {[type]} ctx  [执行上下文]
 * [eg.Router中调用方法]
 * 1.  rander('index',{...},this);
 * 2.  rander.call(this,'index',{...});
 */
function * render(name, group, data ,ctx){
  let self = ctx || this;
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
