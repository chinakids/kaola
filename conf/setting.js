/*
*   全局设置
*/

export {
  //debug 为 true 时，用于本地调试
  DEBUG: false,

  //seeion&cookie相关
  SEEION_SRCRET: 'kaola_secret', //seeion加密字符换
  COOKIE_NAME: 'kaola', //cookie的名称
  ENCRYPT_KEY: 'kaola', //加密用字符串

  //数据库配置
  DB_TYPE: 'mongodb', //数据库类型
  DB_NAME: 'kaola', //数据库名称
  DB_HOST: '', //数据库地址
  DB_PORT: 27017, //数据库端口
  DB_USERNAME: '', //数据库用户名
  DB_PASSWORD: '', //数据库密码

  //站点基础信息配置
  SITE_TITLE: '', //站点名称
  SITE_DOMAIN: '', //站点域名
  SITE_MAIL:'', //站点邮箱
  SITE_ICP: '', //站点备案号
  SITE_VERSION: 'v0.0.1', //静态资源版本戳
  SITE_DISCRIPTION: '', //站点描述
  SITE_KEYWORDS: '', //站点关键字
  SITE_BASICKEYWORDS: '', //基础关键词（忽视文章seo必带的）

  //上传
  UPDATE_FOLDER: process.cwd() + '/public/upload', //默认上传文件夹本地路径

  //本地缓存设置
  REDIS_HOST: '127.0.0.1',
  REDIS_PORT: 6379,
  REDIS_PSD: '',
  REDIS_DB: 0,
}
