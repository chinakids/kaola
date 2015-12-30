import koa from 'koa';
import route from 'koa-router';
import logger from 'koa-logger';
import json from 'koa-json';
import views from 'koa-views';
import onerror from 'koa-onerror';
import koaStatic from 'koa-static';
import koaBodyparser from 'koa-bodyparser';
import session from 'koa-generic-session';
import redisStore from 'koa-redis';
import S from './conf/setting'

import index from './routes/index';
import users from './routes/users';

let app = koa();
let R = route();

// global middlewares
app.use(views('views', {
  root: __dirname + '/views',
  default: 'jade'
}));
app.use(koaBodyparser());
app.use(json());
app.use(logger());

app.use(koaStatic(__dirname + '/public'));

//seeion
app.use(session({
  key: 'kaola.sid',
  prefix: 'kaola:sess:',
  store: redisStore({
    host:S.REDIS_HOST,
    port:S.REDIS_PORT,
    //socket:S.REDIS_SOCKET, //socket
    //pass:S.REDIS_PSD,   //redis连接密码
    db:S.REDIS_DB
  })
}));

app.name = S.NAME;
app.keys = [S.COOKIE_NAME, S.ENCRYPT_KEY];
app.use(function *(next) {
  this.session.name = 'koa-redis';
  yield next;
});
// routes definition
R.use('/', index.routes(), index.allowedMethods());
R.use('/users', users.routes(), users.allowedMethods());

// mount root routes
app.use(R.routes());

app.on('error', (err, ctx) => {
  log.error('server error', err, ctx);
});

export default app;
