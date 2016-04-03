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
import render from './utils/render';
//导入全局设置
import S from './conf/setting'
//导入路由配置
import index from './routes/index';
import users from './routes/users';
import admin from './routes/admin';
import content from './routes/content';
import list from './routes/list';
import search from './routes/search';
import api from './routes/api';
//导入控制部分
import userInfo from './controller/getUserInfo';
//实例化
let app = koa();
let R = route();
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
//链接数据库
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
    socket:S.REDIS_SOCKET, //socket
    pass:S.REDIS_PASSWORD,   //redis连接密码
    db:S.REDIS_DB
  }),
  cookie:{
    maxAge: 24 * 60 * 60 * 3000 //3 day in ms
  }
}));
//设置应用名称
app.name = S.NAME;
//设置cookies相关key
app.keys = [S.COOKIE_NAME, S.ENCRYPT_KEY];
//404&500
app.use(function *(next){
  try {
    yield next;
  } catch (err) {
    let status = err.status || 500;
    // 根据 status 渲染不同的页面
    if (status == 404) {
      yield render('error',{
        debug: S.DEBUG,
        title: '页面未找到',
        referer: this.request.header.referer,
        error: {
          status : 404
        }
      },this);
    }
    if (status == 500) {
      if(this.request.method === 'GET'){
        yield render('error',{
          debug: S.DEBUG,
          title: '系统发生错误',
          referer:this.request.header.referer,
          error: {
            status : 500,
            data: err
          }
        },this);
      }else{
        this.body = {
          status : 'FAIL::系统发生错误',
          error : err
        }
      }
      // 触发 koa 统一错误事件，可以打印出详细的错误堆栈 log
      this.app.emit('error', err, this);
    }
  }
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
R.use(userInfo);
//路由设置
R.use('/', index.routes(), index.allowedMethods());
R.use('/api', api.routes(), api.allowedMethods());
R.use('/content', content.routes(), content.allowedMethods());
R.use('/list', list.routes(), list.allowedMethods());
R.use('/search', search.routes(), search.allowedMethods());
R.use('/users', users.routes(), users.allowedMethods());
R.use('/'+S.ADMIN_DOMAIN, admin.routes(), admin.allowedMethods());

//绑定路由
app.use(R.routes());

//错误监听
app.on('error', function(err, ctx){
  logger('error',err);
});

export default app;
