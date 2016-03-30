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

	var _angular$module$contr, _angular$module$contr2, _angular$module$contr3, _angular$module$contr4, _angular$module$contr5, _angular$module$contr6, _angular$module;

	var _index = __webpack_require__(1);

	var _index2 = _interopRequireDefault(_index);

	var _login = __webpack_require__(2);

	var _login2 = _interopRequireDefault(_login);

	var _good = __webpack_require__(3);

	var _good2 = _interopRequireDefault(_good);

	var _article = __webpack_require__(4);

	var _article2 = _interopRequireDefault(_article);

	var _register = __webpack_require__(5);

	var _register2 = _interopRequireDefault(_register);

	var _lazyImage = __webpack_require__(6);

	var _lazyImage2 = _interopRequireDefault(_lazyImage);

	var _imageSlide = __webpack_require__(7);

	var _imageSlide2 = _interopRequireDefault(_imageSlide);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	//控制器

	//指令集


	console.log('%c Kaola %c Copyright \xa9 2015-%s  Power by github/chinakids', 'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;font-size:64px;color:#00bbee;-webkit-text-fill-color:#00bbee;-webkit-text-stroke: 1px #00bbee;', "font-size:12px;color:#999999;", new Date().getFullYear());

	window.RM = function () {
	  if (window.M) window.M.layout();
	};

	//前端提示设定
	toastr.options = {
	  'closeButton': false,
	  'debug': false,
	  'newestOnTop': true,
	  'progressBar': true,
	  'positionClass': 'toast-top-center',
	  'preventDuplicates': false,
	  'onclick': null,
	  'showDuration': '300',
	  'hideDuration': '1000',
	  'timeOut': '1500',
	  'extendedTimeOut': '1000',
	  'showEasing': 'swing',
	  'hideEasing': 'linear',
	  'showMethod': 'fadeIn',
	  'hideMethod': 'fadeOut'
	};

	(_angular$module$contr = (_angular$module$contr2 = (_angular$module$contr3 = (_angular$module$contr4 = (_angular$module$contr5 = (_angular$module$contr6 = (_angular$module = angular.module('Kaola', ['Kaola.tools'])).controller.apply(_angular$module, _toConsumableArray(_index2.default))).controller.apply(_angular$module$contr6, _toConsumableArray(_login2.default))).controller.apply(_angular$module$contr5, _toConsumableArray(_register2.default))).controller.apply(_angular$module$contr4, _toConsumableArray(_good2.default))).controller.apply(_angular$module$contr3, _toConsumableArray(_article2.default))).directive.apply(_angular$module$contr2, _toConsumableArray(_lazyImage2.default))).directive.apply(_angular$module$contr, _toConsumableArray(_imageSlide2.default));

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
	  // let addMasonry = (data) => {
	  //   for (let i = 0, len=data.length; i<len; i++) {
	  //     // let template = `
	  //     //   <li class='grid-item'>
	  //     //     <div class='img-box'>
	  //     //       <a class='img' href='/${data[i].info ? 'good' : 'article'}/${data[i]._id}'>
	  //     //         <img src='${getFirstImage(JSON.parse(data[i].imgList))}' onload='RM()' onerror='this.src="fontend/img/bg/nopicture.jpg"'/>
	  //     //       </a>
	  //     //       <p class='num'>
	  //     //         <a class='watch-num' href='javascript:;'>
	  //     //           <i class='fa fa-eye'></i> ${data[i].statistics.view}
	  //     //         </a>
	  //     //         <a class='like-num' href='javascript:;'>
	  //     //           <i class='fa fa-heart'></i> ${data[i].statistics.like}
	  //     //         </a>
	  //     //       </p>
	  //     //     </div>
	  //     //     <div class='clearfix'>
	  //     //       <a class='img-name' href='/${data[i].type === 'good' ? 'good' : 'article'}/${data[i]._id}'>${data[i].title}</a>
	  //     //       ${data[i].info ? '<p class=\'sort\'><i class=\'fa fa-location-arrow\'></i> '+data[i].info.location+'</p>' : ''}
	  //     //       <a class='method clefafix' href='/users/${data[i].author._id}'>
	  //     //         <span style='background-image:url(${data[i].author.avatar});'></span>
	  //     //         <b>${data[i].author.nickName}</b>
	  //     //       </a>
	  //     //     </div>
	  //     //   </li>`;
	  //     // $('.js-masonry').append(template);
	  //     window.M.reloadItems();
	  //   };
	  // }
	  // addMasonry(window.list);
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
	var controller = ['GoodCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
	  $scope.like = function (id) {
	    $.post('/api/addLike?id=' + id + '&type=good', {}, function (res) {
	      var status = res.status.split('::')[0],
	          msg = res.status.split('::')[1];
	      if (status === 'SUCCESS') {
	        toastr.success(msg);
	        $('#like span').text(res.data);
	      } else {
	        toastr.error(msg);
	      }
	    });
	  };
	}]];
	exports.default = controller;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var controller = ['ArticleCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
	  $scope.like = function (id) {
	    $.post('/api/addLike?id=' + id + '&type=article', {}, function (res) {
	      var status = res.status.split('::')[0],
	          msg = res.status.split('::')[1];
	      if (status === 'SUCCESS') {
	        toastr.success(msg);
	        $('#like span').text(res.data);
	      } else {
	        toastr.error(msg);
	      }
	    });
	  };
	}]];
	exports.default = controller;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var controller = ['RegisterCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
	  $scope.index = 'xx';
	}]];
	exports.default = controller;

/***/ },
/* 6 */
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

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var directive = ['imageSlide', ['$window', '$document', function ($win, $doc) {
	  return {
	    restrict: 'EMAC',
	    replace: true,
	    template: '\n          <div class=\'row margin-bottom image-box\' ng-if=\'remove\'>\n            <div class=\'col-sm-8\'>\n              <div class=\'big-img\'><img class=\'img-responsive\' ng-src=\'{{showImage.url}}\' alt=\'Photo\'/></div>\n            </div>\n            <div class=\'col-sm-4\'>\n              <div class=\'row\'>\n                <div class=\'col-xs-6\'>\n                <div class=\'small-img\' ng-repeat=\'item in leftData track by $index\'><img class=\'img-responsive\' ng-src=\'{{item.url}}\' ng-click=\'show(item)\' alt=\'Photo\'/></div>\n                </div>\n                <div class=\'col-xs-6\'>\n                <div class=\'small-img\' ng-repeat=\'item in rightData track by $index\'><img class=\'img-responsive\' ng-src=\'{{item.url}}\' ng-click=\'show(item)\' alt=\'Photo\'/></div>\n                </div>\n              </div>\n            </div>\n          </div>\n        ',
	    controller: ['$scope', function ($scope) {
	      $scope.rightData = [];
	      $scope.leftData = [];
	      $scope.remove = true;
	      $scope.showImage = '';
	      $scope.show = function (obj) {
	        $scope.showImage = obj;
	      };
	    }],
	    link: function link($scope, $elem, attrs) {
	      var data = JSON.parse(attrs.data);
	      var index = 1;
	      for (var item in data) {
	        if (index === 1) $scope.showImage = data[item];
	        if (index % 2 === 0) {
	          $scope.rightData.push(data[item]);
	        } else {
	          $scope.leftData.push(data[item]);
	        }
	        index++;
	      }
	      if (index === 1) $scope.remove = false;
	    }
	  };
	}]];
	exports.default = directive;

/***/ }
/******/ ]);