/**
 * [setLog 用来记录用户操作,非阻塞操作]
 */
import logModel from '../models/Logs';
import logger from './../utils/logger';

let setLog = (type,msg,ctx,level = 4) => {
  let ip = ctx.req.headers['x-forwarded-for'] || ctx.req.connection.remoteAddress || ctx.req.socket.remoteAddress || ctx.req.connection.socket.remoteAddress;
  let log = new logModel({
    type      : type,
    content   : msg,
    level     : level,
    user      : ctx.session.userInfo._id || ip
  })
  log.save((err, log) => {
    if(err){
      logger('err',err);
    }
  });
}

export default setLog;