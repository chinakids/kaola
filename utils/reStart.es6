import childProcess from 'child_process';
import logger from './logger';
import S from './../conf/setting';
/**
 * [reStart 重启服务器]
 */

//命令行执行方法
function E(cmdStr){
  logger('error','执行:'+cmdStr);
  childProcess.exec(cmdStr, function(err,stdout,stderr){
    if(err) {
      logger('error','错误:'+stderr);
    } else {
      logger('error','成功');
    }
  });
};

//重启函数
function reStart(){
  //重启pm2方法
  const rePm2 = () => {

  }
  //重启node进程方法
  const reNode = () => {

  }
  //重启supervisor方法
  const reSupervisor = () => {

  }
  //重启forever方法
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
