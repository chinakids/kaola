
//控制器
import index from './controller/index.es6';
import login from './controller/login.es6';

window.RM = function(){
  console.log(window.M);
  if(window.M) window.M.layout();
}

angular.module('Kaola', ['Kaola.tools'])
.controller(index[0],index[1])
.controller(login[0],login[1])
