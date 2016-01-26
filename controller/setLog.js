/**
 * [setLog 用来记录用户操作]
 */
import Log from '../models/Log';
import logger from './../utils/logger';

function setLog(type,msg,level = 'p4'){
  let _log = new templateModel({
    type      : type,
    msg       : msg,
    group     : level,
    user      : this.session.userInfo._id
  })
  _log.save((err, log) => {
    if(err){
      logger('err',err);
    }
  });
}

export default setLog;
