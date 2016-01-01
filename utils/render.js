import jadeRuntime from 'jade/runtime';
import templateModel from './../models/Template';
/**
 * [render 返回页面的方法]
 */
function render(name, data){
  let promise = new Promise(function(resolve, reject){
    templateModel.findByName(name, (err,templates) => {
      if(err){
        logger('model',err);
      }else{
        let templateJS= new Function('jade','data',templates[0].content+';return template(data)');
        resolve(templateJS(jadeRuntime,data));
      }
    })
  })
  return promise;
}

export default render;
