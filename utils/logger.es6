import fs from 'fs';
import miniLogger from 'mini-logger';
import S from './../conf/setting';
/**
 * [Logger 日志输出到文本]
 * @param {[type]} dir  [日志输出目录]
 * @param {[type]} categories  [自定义类型]
 * @param {[type]} format  [格式化日志名]
 */

let logger = miniLogger({
    dir: S.LOG_DIR,
    categories: S.LOG_CATEGORIES,
    format: 'YYYY-MM-DD-[{category}][.log]'
});
/**
 * [print 日志输出]
 * @param  {[type]} categories [日志类型]
 * @param  {[type]} ...info    [日志内容]
 */
let print = (categories,info) => {
  if(categories === 'error'){
    logger.error(info);
  }else{
    if('function' === typeof logger[categories]){
      logger[categories]((new Date()).toLocaleString()+'\t'+info);
    }else{
      logger.error(categories+'不存在,请在conf/setting.js中设置,下面为本次错误');
      logger.error(info);
    }
  }
}

export default print;