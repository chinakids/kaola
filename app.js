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
  store: redisStore()
}));

// routes definition
R.use('/', index.routes(), index.allowedMethods());
R.use('/users', users.routes(), users.allowedMethods());

// mount root routes
app.use(R.routes());

app.on('error', function(err, ctx){
  log.error('server error', err, ctx);
});

export default app;
