
//控制器
import index from './controller/index.es6';
import login from './controller/login.es6';
import good from './controller/good.es6';
import article from './controller/article.es6';
import register from './controller/register.es6';
//指令集
import lazyImage from './directive/lazyImage.es6';
import imageSlide from './directive/imageSlide.es6';

console.log('%c Kaola %c Copyright \xa9 2015-%s  Power by github/chinakids','font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;font-size:64px;color:#00bbee;-webkit-text-fill-color:#00bbee;-webkit-text-stroke: 1px #00bbee;',"font-size:12px;color:#999999;",(new Date).getFullYear())

window.RM = () => {
  if(window.M) window.M.layout();
}

//前端提示设定
toastr.options = {
  'closeButton': false,
  'debug': false,
  'newestOnTop': true,
  'progressBar': false,
  'positionClass': 'toast-bottom-center',
  'preventDuplicates': false,
  'onclick': null,
  'showDuration': '300',
  'hideDuration': '1000',
  'timeOut': '2000',
  'extendedTimeOut': '1000',
  'showEasing': 'swing',
  'hideEasing': 'linear',
  'showMethod': 'slideDown',
  'hideMethod': 'fadeOut'
}


angular.module('Kaola', ['Kaola.tools'])
.controller(...index)
.controller(...login)
.controller(...register)
.controller(...good)
.controller(...article)
.directive(...lazyImage)
.directive(...imageSlide)