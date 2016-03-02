import fs from 'fs';
import miniLogger from 'mini-logger';
import S from './../conf/setting';
/**
 * [print 日志输出]
 * @param  {[type]} categories [日志类型]
 * @param  {[type]} ...info    [日志内容]
 */
let print = (categories, info) => {
  let date = new Date();
  let dir = S.LOG_DIR;
  let dirYear = dir +'/'+date.getFullYear();
  let dirMonth = dirYear +'/'+(date.getMonth() + 1);
  let dirDay = dirMonth+'/'+date.getDate();
  if(!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  };
  if(!fs.existsSync(dirYear)){
    fs.mkdirSync(dirYear);
  };
  if(!fs.existsSync(dirMonth)){
    fs.mkdirSync(dirMonth);
  };
  if(!fs.existsSync(dirDay)){
    fs.mkdirSync(dirDay);
  };
  let logger = miniLogger({
    dir: dirDay,
    categories: S.LOG_CATEGORIES,
    format: '[{category}][.log]'
  });

  if (categories === 'error') {
    logger.error(info);
  } else {
    if ('function' === typeof logger[categories]) {
      logger[categories]((new Date()).toLocaleString() + '\t' + info);
    } else {
      logger.error(categories + '不存在,请在conf/setting.js中设置,下面为本次错误');
      logger.error(info);
    }
  }
}

export default print;