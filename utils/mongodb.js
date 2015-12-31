import mongoose from 'mongoose';
import logger from './logger'
import temlateCache from './TemplateCache';
import S from './../conf/setting';
/**
 * [connect mongodb链接方法]
 */
function connect(){
  let C;
  if(dbUsername === '' || dbPassword === ''){
    //console.log('空口令登入')
    C = mongoose.connect(`mongodb://${S.DB_HOST}:${S.DB_PORT}/${S.DB_NAME}`);
    C.connection.on('error',logger('model','数据库连接断开'));
    C.connection.on('connected',() => {
      logger('model','数据库已连接')
      temlateCache();
    });
    C.connection.on('disconnected',logger('model','数据库链接失败'));
  }else{
    //console.log('加密登入')
    C = mongoose.connect(`mongodb://${S.DB_USERNAME}:${S.DB_PASSWORD}@${S.DB_HOST}:${S.DB_PORT}/${S.DB_NAME}`);
    C.connection.on('error',logger('model','数据库链接失败'));
    C.connection.on('connected',() => {
      logger('model','数据库已连接')
      temlateCache();
    });
    C.connection.on('disconnected',logger('model','数据库连接断开'));

  }
  return C
}

export default connect;
