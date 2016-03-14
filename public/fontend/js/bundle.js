/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _index = __webpack_require__(1);

	var _index2 = _interopRequireDefault(_index);

	var _login = __webpack_require__(2);

	var _login2 = _interopRequireDefault(_login);

	var _lazyImage = __webpack_require__(3);

	var _lazyImage2 = _interopRequireDefault(_lazyImage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	window.RM = function () {
	  if (window.M) window.M.layout();
	};
	//指令集

	//控制器


	angular.module('Kaola', ['Kaola.tools']).controller(_index2.default[0], _index2.default[1]).controller(_login2.default[0], _login2.default[1]).directive(_lazyImage2.default[0], _lazyImage2.default[1]);

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var controller = ['IndexCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
	  $(window).scroll(function () {
	    if ($(document).scrollTop() >= 280) {
	      $('.navbar').removeClass('opacity');
	    } else {
	      $('.navbar').addClass('opacity');
	    }
	  });
	  window.M = new Masonry('.js-masonry', {
	    // options...
	    itemSelector: '.grid-item',
	    columnWidth: 10
	  });
	  var getFirstImage = function getFirstImage(list) {
	    for (var item in list) {
	      return list[item].url;
	      break;
	    }
	  };
	  var addMasonry = function addMasonry(data) {
	    var html = [];
	    for (var i = 0, len = data.length; i < len; i++) {
	      var template = '\n            <li class=\'grid-item\'>\n              <div class=\'img-box\'>\n                <a class=\'img\' href=\'#\'>\n                  <img src=\'' + getFirstImage(JSON.parse(data[i].imgList)) + '\' onload=\'RM()\'/>\n                </a>\n                <p class=\'num\'>\n                  <a class=\'watch-num\' href=\'javascript:;\'>\n                    <i class=\'fa fa-eye\'></i> ' + data[0].statistics.view + '\n                  </a>\n                  <a class=\'like-num\' href=\'javascript:;\'>\n                    <i class=\'fa fa-heart\'></i> ' + data[0].statistics.like + '\n                  </a>\n                </p>\n              </div>\n              <div class=\'clearfix\'>\n                <a class=\'img-name\' href=\'#\'>' + data[0].title + '</a>\n                <p class=\'sort\'>\n                  <i class=\'fa fa-location-arrow\'></i> ' + data[0].info.location + '\n                </p>\n                <a class=\'method clefafix\' href=\'#\'>\n                  <span style=\'background-image:url(' + data[0].author.avatar + ');\'></span>\n                  <b>' + data[0].author.nickName + '</b>\n                </a>\n              </div>\n            </li>';
	      html.push(template);
	      $('.js-masonry').append(html.join(''));
	      window.M.reloadItems();
	    };
	  };
	  addMasonry(window.list);
	}]];
	exports.default = controller;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var controller = ['LoginCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
	  $scope.index = 'xx';
	}]];
	exports.default = controller;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var directive = ['lazySrc', ['$window', '$document', function ($win, $doc) {
	  var win = angular.element($win);
	  var doc = $doc[0];
	  var isLazyLoading = false;
	  //用来维护当前需要lazyload的图片集合
	  var elements = function () {
	    var _uid = 0;
	    var _list = {};
	    return {
	      push: function push(_data) {
	        _list[_uid++] = _data;
	        setTimeout(function () {
	          checkImage(_data);
	        });
	      },
	      del: function del(key) {
	        _list[key] && delete _list[key];
	      },
	      size: function size() {
	        return Object.keys(_list).length;
	      },
	      get: function get() {
	        return _list;
	      }
	    };
	  }();
	  //判断图片元素是否在可视区域内，如果超出1/3可见，则显示
	  var isVisible = function isVisible(elem) {
	    var rect = elem[0].getBoundingClientRect();
	    var ret = true;
	    if (rect.height > 0 && rect.width > 0) {
	      var x = rect.top > 0 && rect.top + rect.height / 3 < Math.max(doc.documentElement.clientHeight, win.innerHeight || 0);
	      var y = rect.left > 0 && rect.left + rect.width / 3 < Math.max(doc.documentElement.clientWidth, win.innerWidth || 0);
	      ret = x && y;
	    }
	    return ret;
	  };
	  //每次scroll时，调用checkImage，循环检查图片
	  var checkImage = function checkImage(evt, i, item) {
	    if (i >= 0 && item) {
	      return isVisible(item.elem) ? item.load(i) : false; //指定检查，返回是否显示
	    } else if (elements.size() == 0) {
	        //全部显示之后，解除绑定
	        win.off('scroll', checkImage);
	        win.off('resize', checkImage);
	        isLazyLoading = false;
	      } else {
	        angular.forEach(elements.get(), function (item, key) {
	          //循环检查
	          isVisible(item.elem) && item.load(key);
	        });
	      }
	  };
	  //初始化，绑定scroll
	  //如果已经全部显示了，会off，若有新的指令（ajax、js载入需要lazyload的内容），会重新绑定scroll
	  var initLazyLoad = function initLazyLoad() {
	    if (isLazyLoading === false) {
	      isLazyLoading = true;
	      win.on('scroll', checkImage);
	      win.on('resize', checkImage);
	    }
	  };
	  return {
	    restrict: 'A', //仅可以使用  attr
	    scope: {}, //独立的scope
	    link: function link($scope, $elem, attrs) {
	      $elem[0].style.cssText && $elem.data('cssText', $elem[0].style.cssText);
	      $elem.css({ 'min-width': '1px', 'min-height': '1px' });
	      //传回调参数，不$watch 状态，以免增加过多
	      elements.push({
	        elem: $elem,
	        load: function load(key) {
	          $elem.data('cssText') && ($elem[0].style.cssText = $elem.data('cssText'));
	          $elem.removeClass('ng-lazyload');
	          $elem.attr('src', attrs.lazySrc);
	          key >= 0 && elements.del(key);
	          $scope.$destroy();
	          return true;
	        }
	      });
	      initLazyLoad();
	    }
	  };
	}]];
	exports.default = directive;

/***/ }
/******/ ]);