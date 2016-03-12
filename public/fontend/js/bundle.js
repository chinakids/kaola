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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//控制器


	window.RM = function () {
	  console.log(window.M);
	  if (window.M) window.M.layout();
	};

	angular.module('Kaola', ['Kaola.tools']).controller(_index2.default[0], _index2.default[1]).controller(_login2.default[0], _login2.default[1]);

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

/***/ }
/******/ ]);