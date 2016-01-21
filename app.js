import koa from 'koa';
import route from 'koa-router';
import koaLogger from 'koa-logger';
import logger from './utils/logger';
import json from 'koa-json';
import views from 'koa-views';
import onerror from 'koa-onerror';
import koaStatic from 'koa-static';
import koaBodyparser from 'koa-bodyparser';
import session from 'koa-generic-session';
import redisStore from 'koa-redis';
import connect from './utils/mongodb';
import render from './utils/render';
//导入全局设置
import S from './conf/setting'
//导入路由配置
import index from './routes/index';
import users from './routes/users';
import admin from './routes/admin';
import api from './routes/api';
//实例化
let app = koa();
let R = route();
let C = connect();
//设置模板相关参数
app.use(views('views', {
  root: __dirname + '/views',
  default: 'jade'
}));
//设置body-parser先关参数
app.use(koaBodyparser({
  formLimit:'5mb',
  jsonLimit:'200kb'
}));
app.use(json());
app.use(koaLogger());
//设置静态资源相关参数
app.use(koaStatic(__dirname + '/public'));
//设置seeion相关册数
app.use(session({
  key: 'kaola.sid',
  prefix: 'kaola:sess:',
  store: redisStore({
    host:S.REDIS_HOST,
    port:S.REDIS_PORT,
    //socket:S.REDIS_SOCKET, //socket
    //pass:S.REDIS_PASSWORD,   //redis连接密码
    db:S.REDIS_DB
  })
}));
//设置应用名称
app.name = S.NAME;
//设置cookies相关key
app.keys = [S.COOKIE_NAME, S.ENCRYPT_KEY];
//404
app.use(function *(next){
  yield next;
  if (this.status !== 404) return;
  this.status = 404;
  yield render('error','fontend', {
    debug: S.DEBUG,
    title: 'Not Found'
  },this);
})
//过滤非法URL请求
app.use(function *(next){
  let allow = false;
  for(let item in S.ALLOW_DOMAIN){
    if(this.hostname === S.ALLOW_DOMAIN[item]){
      allow = true;
    }
  }
  if(allow){
    yield next;
  }
})
//路由设置
R.use('/', index.routes(), index.allowedMethods());
R.use('/api', api.routes(), api.allowedMethods());
R.use('/users', users.routes(), users.allowedMethods());
R.use('/'+S.ADMIN_DOMAIN, admin.routes(), admin.allowedMethods());

//绑定路由
app.use(R.routes());

//错误监听
app.on('error', function(err, ctx){
  logger('error',err);
});

export default app;
