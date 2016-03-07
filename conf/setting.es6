import fs from 'fs';
/*
*   全局设置
*/

//读取项目基本信息
const baseInfo=JSON.parse(fs.readFileSync(process.cwd() + '/package.json','utf-8'));
//全局设置
const globalSetting =  {
  //应用信息
  NAME: baseInfo.name, //应用名称
  VERSION: 'v'+baseInfo.version, //应用版本
  AUTHOR: 'chinakids', //作者
  ALLOW_DOMAIN: ['127.0.0.1'], //域名白名单,只允许名单内的域名访问,false为不开启
  ADMIN_DOMAIN: 'admin', //进入管理后台的url，‘http://{{ALLOW_DOMAIN}}/{{ADMIN_DOMAIN}}’

  //debug 为 true 时,用于本地调试,
  DEBUG: true, //开启时,模板将不会使用预编译
  SERVICE: 'pm2',  //进程维护工具
  NEED_INIT: false, //是否需要初始化管理员账户，设置为true访问 ‘http://{{ALLOW_DOMAIN}}/{{ADMIN_DOMAIN}}/init’设置管理员账户,设置完毕记得关掉

  //日志记录
  LOG_DIR:process.cwd() + '/.log', //日志目录
  LOG_CATEGORIES:['router','model','template'], //日志类型 logger(name,...)中的name

  //seeion&cookie相关
  COOKIE_NAME: 'kaola', //cookie的名称
  ENCRYPT_KEY: 'csN%vm*XycUbKSfN3cvj3CO!9tPna*LU', //加密用字符串,正式上线请务必修改

  //数据库配置
  DB_TYPE: 'mongodb', //数据库类型 目前只支持mongodb
  DB_NAME: 'kaola', //数据库名称
  DB_HOST: '127.0.0.1', //数据库地址
  DB_PORT: 27017, //数据库端口
  DB_USERNAME: '', //数据库用户名
  DB_PASSWORD: '', //数据库密码

  //站点基础信息配置
  SITE_TITLE: 'kaola', //站点名称
  SITE_DOMAIN: '', //站点域名,这里是个主域名
  SITE_MAIL:'', //站点邮箱
  SITE_ICP: '', //站点备案号
  SITE_VERSION: 'v'+baseInfo.version, //静态资源版本戳
  SITE_DISCRIPTION: '', //站点描述
  SITE_KEYWORDS: '', //站点关键字
  SITE_BASICKEYWORDS: '', //基础关键词（忽视文章seo必带的）

  //本地redis设置
  REDIS_HOST: '127.0.0.1',  //redis地址
  REDIS_PORT: 6379,  //redis端口
  REDIS_SOCKET: null, //redis socket
  REDIS_PASSWORD: '', //redis密码
  REDIS_DB: 0, //redis数据库

  //邮件相关配置,链接类型为SMTP
  MAIL_HOST:'',//SMTP地址
  MAIL_PORT: 465,//SMTP端口
  MAIL_SSL: true,//是否使用ssl
  MAIL_NICKNAME:'',//发送人昵称
  MAIL_USERNAME:'',//发送账户名
  MAIL_PASSWORD:'',//发送账户密码
}

export default globalSetting;
