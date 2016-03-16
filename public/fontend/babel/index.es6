
//控制器
import index from './controller/index.es6';
import login from './controller/login.es6';
import good from './controller/good.es6';
//指令集
import lazyImage from './directive/lazyImage.es6';
import imageSlide from './directive/imageSlide.es6';

window.RM = () => {
  if(window.M) window.M.layout();
}

angular.module('Kaola', ['Kaola.tools'])
.controller(index[0],index[1])
.controller(login[0],login[1])
.controller(good[0],good[1])
.directive(lazyImage[0],lazyImage[1])
.directive(imageSlide[0],imageSlide[1])