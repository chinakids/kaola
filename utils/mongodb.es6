import mongoose from 'mongoose';
import logger from './logger';
import templateCache from './TemplateCache';
import S from './../conf/setting';
/**
 * [connect mongodb链接方法]
 */
function connect(){
  if(S.DB_USERNAME === '' && S.DB_PASSWORD === ''){
    //console.log('空口令登入')
    mongoose.connect(`mongodb://${S.DB_HOST}:${S.DB_PORT}/${S.DB_NAME}`,(err) => {
      if(err){
        logger('model',err);
      }else{
        logger('model','数据库已连接');
        //异步去缓存模板
        templateCache();
      };
    });
    //yield next;
  }else{
    //console.log('加密登入')
    mongoose.connect(`mongodb://${S.DB_USERNAME}:${S.DB_PASSWORD}@${S.DB_HOST}:${S.DB_PORT}/${S.DB_NAME}`,(err) => {
      if(err){
        logger('model',err);
      }else{
        logger('model','数据库已连接');
        //异步去缓存模板
        templateCache();
      };
    });
  }
}

export default connect;
