import miniLogger from 'mini-logger';
import S from './../conf/setting';
/**
 * [Logger 日志输出到文本]
 * @param {[type]} dir  [日志输出目录]
 * @param {[type]} categories  [自定义类型]
 * @param {[type]} format  [和石化日志名]
 */
let logger = miniLogger({
    dir: S.LOG_DIR,
    categories: ['router','model','template'],
    format: 'YYYY-MM-DD-[{category}][.log]'
});

let print = function(categories,info){
  if(categories === 'error'){
    // console.log(log)
    // log.error('server error', info, ctx);
    logger.error(info);
  }else{
    if('function' === typeof logger[categories]){
      logger[categories](info);
    }
  }
}

export default print;
