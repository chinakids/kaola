import childProcess from 'child_process';
import logger from './logger';
import S from './../conf/setting';
/**
 * [reStart 重启服务器]
 */
function E(){
  childProcess.exec(cmdStr, function(err,stdout,stderr){
    if(err) {
      logger('错误:'+stderr);
    } else {
      logger('成功');
    }
  });
};

function reStart(){
  const rePm2 = () => {

  }

  const reNode = () => {

  }

  const reSupervisor = () => {

  }

  const reForever = () => {

  }

  switch(S.SERVICE){
    case 'pm2':
      rePm2();
      break;
    case 'node':
      reNode();
      break;
    case 'supervisor':
      reSupervisor();
      break;
    case 'forever':
      reForever();
      break;
    default:
      return null;
  }

}


export default reStart;
