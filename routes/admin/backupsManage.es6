import router from 'koa-router';
import render from './../../utils/render';
import fs from 'fs';
import cp from 'child_process';
import getPageCount from './../../controller/getPageCount';
import S from './../../conf/setting';
import check from './../../controller/getAccess';
import setLog from './../../controller/setLog';

let R = router();

R.use(check.login())

/**
 * 数据库管理相关
 */
//数据库管理 - 查看
R.get('/', check.access('backupsManage-view'), function*(next) {
  let dirList = fs.readdirSync(process.cwd()+'/.bak');
  let backupsList = [];
  dirList.forEach((item) => {
    if(fs.statSync(process.cwd()+'/.bak/'+ item).isDirectory()){
      backupsList.push(item);
    }
  })
  let sortNumber = function(a, b){
    return a - b;
  }
  yield render('backupsManage', {
    title: '数据备份管理',
    desc: '只取前十条记录',
    backupsList: JSON.stringify(backupsList.sort(sortNumber).reverse().slice(0,10)) //TODO 后期需要改,这里写死了先做排序/倒序处理
  }, this);
});
//数据库管理 - 新增
R.post('/addBackup', check.access('backupsManage-add'), function*(next) {
  //日志记录
  setLog('新增','新增数据库备份',this);
  let time = Date.parse(new Date());
  if(!fs.existsSync(process.cwd()+'/.bak/'+time)){
    //创建备份
    cp.execSync(`mongodump -h ${S.DB_HOST}:${S.DB_PORT} -d ${S.DB_NAME} -o ${process.cwd()}/.bak/${time}`);
    this.body = {
      status: 'SUCCESS::备份成功'
    }
  }
});
//数据库管理 - 删除
R.post('/delBackup', check.access('backupsManage-del'), function*(next) {
  let parm = this.request.body;
  //日志记录
  if(fs.existsSync(process.cwd()+'/.bak/'+parm.time)){
    //删除备份
    if(process.platform === 'win32'){
      cp.execSync(`del /f /s /q ${process.cwd()}/.bak/${parm.time}`);
    }else{
      cp.execSync(`rm -R ${process.cwd()}/.bak/${parm.time}`);
    }
    //日志记录
    setLog('删除',`删除数据库备份(time:${parm.time})成功`,this);
    this.body = {
      status: 'SUCCESS::删除备份成功'
    }
  }else{
    this.body = {
      status: 'FAIL::不存在此备份'
    }
  }
});
//数据库管理 - 恢复 TODO 还要加带密码版本的
R.post('/restore', check.access('backupsManage-re'), function*(next) {
  let parm = this.request.body;
  //日志记录
  setLog('恢复',`尝试恢复数据库备份(time:${parm.time})`,this);
  if(fs.existsSync(process.cwd()+'/.bak/'+parm.time)){
    //删除备份
    if(S.DB_USERNAME === '' && S.DB_PASSWORD === ''){
      if(parm.drop == 'true'){
        cp.execSync(`mongorestore -h ${S.DB_HOST}:${S.DB_PORT} -d ${S.DB_NAME} ${process.cwd()}/.bak/${parm.time}/${S.DB_NAME} --drop`);
        //日志记录
        setLog('恢复',`全量恢复数据库备份(time:${parm.time})成功`,this);
      }else{
        cp.execSync(`mongorestore -h ${S.DB_HOST}:${S.DB_PORT} -d ${S.DB_NAME} ${process.cwd()}/.bak/${parm.time}/${S.DB_NAME}`);
        //日志记录
        setLog('恢复',`增量恢复数据库备份(time:${parm.time})成功`,this);
      }
      this.body = {
        status: 'SUCCESS::恢复备份成功'
      }
    }else{
      if(parm.drop == 'true'){
        cp.execSync(`mongorestore -h ${S.DB_HOST}:${S.DB_PORT} -d ${S.DB_NAME} -u ${S.DB_USERNAME} -p ${S.DB_PASSWORD} ${process.cwd()}/.bak/${parm.time}/${S.DB_NAME} --drop`);
        //日志记录
        setLog('恢复',`全量恢复数据库备份(time:${parm.time})成功`,this);
      }else{
        cp.execSync(`mongorestore -h ${S.DB_HOST}:${S.DB_PORT} -d ${S.DB_NAME} -u ${S.DB_USERNAME} -p ${S.DB_PASSWORD} ${process.cwd()}/.bak/${parm.time}/${S.DB_NAME}`);
        //日志记录
        setLog('恢复',`增量恢复数据库备份(time:${parm.time})成功`,this);
      }
      this.body = {
        status: 'SUCCESS::恢复备份成功'
      }
    }
  }else{
    this.body = {
      status: 'FAIL::不存在此备份'
    }
  }
});

export default R;