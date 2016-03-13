
//控制器
import index from './controller/index.es6';
import login from './controller/login.es6';
//指令集
import lazyImage from './directive/lazyImage';

window.RM = function(){
  if(window.M) window.M.layout();
}

angular.module('Kaola', ['Kaola.tools'])
.controller(index[0],index[1])
.controller(login[0],login[1])
.directive(lazyImage[0],lazyImage[1])
