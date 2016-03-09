window.URL = {
  parse:function(str){
    var reg = /([^=&\s]+)[=\s]*([^=&\s]*)/g;
    var obj = {};
    while(reg.exec(decodeURI(str.substring(1)))){
        obj[RegExp.$1] = RegExp.$2;
    }
    return obj;
  },
  format:function(obj){
    return $.param(obj)
  }
}

//全局toast配置
toastr.options = {
  'closeButton': true,
  'debug': false,
  'newestOnTop': true,
  'progressBar': true,
  'positionClass': 'toast-top-right',
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
}
//angular-tools模块
angular.module('Kaola.tools', [])
  .filter('md5', function() {
    return function(str) {
      if (CryptoJS) {
        return CryptoJS.MD5(str).toString();
      } else {
        return false;
      }
    }
  })
  //将权限数组过滤成可读字符串
  .filter('powerStr', function() {
    return function(str) {
      var arr = [],
        json = JSON.parse(str)
      for (var item in json) {
        if (json[item]) {
          arr.push(item);
        }
      }
      return '[' + arr.join('],[') + ']';
    }
  })
  //字符串长度限制
  .filter('subStr', function() {
    return function(str,len) {
      return str.substring(0,len)+'···';
    }
  })
  //input正则验证，除预置验证外，也可自己传入正则
  .directive('reg', ['$rootScope', function($rootscope) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var _ele = element[0],
          _reg = attrs.reg.toLowerCase(),
          _errTip = attrs.errTip,
          dataType = {
            '*': /[\w\W]+/, //不为空
            '*6-16': /^[\w\W]{6,16}$/, //6-16位任意字符
            'n': /^\d+$/, //数字
            'n6-16': /^\d{6,16}$/, //6-16位数字
            'c':/^[A-Za-z]+$/, //类目只能为英文不为空
            's': /^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]+$/, //不允许特殊字符
            's6-18': /^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]{6,18}$/, //不包含特殊字符的6-18位任意
            's1-6': /^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]{1,6}$/, //不包含特殊字符的1-6位任意
            'nick': /^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]{1,12}$/, //不包含特殊字符的1-12位任意,昵称
            'p': /^[0-9]{6}$/, //邮政编码
            'm': /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/, //手机号码
            'e': /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, //邮箱
            'url': /^(\w+:\/\/)?\w+(\.\w+)+.*$/ //网站
          };

        function callback(e) {
          if (e == null) {
            element.removeClass('reg-success').addClass('reg-error');
            element.val('');
            // 置空model
            var str = 'scope["' + attrs.ngModel.split('.').join('"]["') + '"] = ""';
            eval(str);
            element.attr('placeholder', _errTip)
          } else {
            element.removeClass('reg-error').addClass('reg-success');
          }
        }

        function blurEvent(reg) {
          _ele.addEventListener('blur', function() {
            var _val = _ele.value,
              regText = dataType[reg];
            if (regText == undefined) {
              var status = _val.match(eval(reg));
              callback(status);
            } else {
              var status = _val.match(regText);
              callback(status);
            };
          }, false);
        }
        blurEvent(_reg);
      }
    }
  }])
  //input追随验证
  .directive('regto', ['$rootScope', function($rootscope) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var _ele = element[0],
          _errTip = attrs.errTip,
          _regto = attrs.regto;
        _ele.addEventListener('blur', function() {
          var _val = _ele.value,
            _prevVal = angular.element(document.getElementById(_regto)).val();
          if (_val != _prevVal) {
            element.removeClass('reg-success').addClass('reg-error');
            element.val('');
            element.attr('placeholder', _errTip)
          } else {
            element.removeClass('reg-error').addClass('reg-success');
          }
        }, false);
      }
    }
  }])
  //权限模型
  .factory('powerModal', function() {
    var powerModal = [{
      id: 'goodsManage',
      pId: 0,
      name: '商品管理',
      open: true
    }, {
      id: 'goodsManage-add',
      pId: 'goodsManage',
      name: '新增'
    }, {
      id: 'goodsManage-view',
      pId: 'goodsManage',
      name: '查看'
    }, {
      id: 'goodsManage-edit',
      pId: 'goodsManage',
      name: '修改'
    }, {
      id: 'goodsManage-del',
      pId: 'goodsManage',
      name: '删除'
    }, {
      id: 'articlesManage',
      pId: 0,
      name: '文章管理',
      open: true
    }, {
      id: 'articlesManage-add',
      pId: 'articlesManage',
      name: '新增'
    }, {
      id: 'articlesManage-view',
      pId: 'articlesManage',
      name: '查看'
    }, {
      id: 'articlesManage-edit',
      pId: 'articlesManage',
      name: '修改'
    }, {
      id: 'articlesManage-del',
      pId: 'articlesManage',
      name: '删除'
    }, {
      id: 'tagsManage',
      pId: 0,
      name: '标签管理',
      open: true
    }, {
      id: 'tagsManage-view',
      pId: 'tagsManage',
      name: '查看'
    }, {
      id: 'categoriesManage',
      pId: 0,
      name: '分类管理',
      open: true
    }, {
      id: 'categoriesManage-view',
      pId: 'categoriesManage',
      name: '更新'
    },{
      id: 'usersManage',
      pId: 0,
      name: '用户管理',
      open: true
    }, {
      id: 'usersManage-add',
      pId: 'usersManage',
      name: '新增'
    }, {
      id: 'usersManage-view',
      pId: 'usersManage',
      name: '查看'
    }, {
      id: 'usersManage-edit',
      pId: 'usersManage',
      name: '修改'
    }, {
      id: 'usersManage-del',
      pId: 'usersManage',
      name: '删除'
    }, {
      id: 'systemManage',
      pId: 0,
      name: '系统管理',
      open: true
    }, {
      id: 'adminManage',
      pId: 'systemManage',
      name: '系统用户管理',
      open: true
    }, {
      id: 'adminManage-add',
      pId: 'adminManage',
      name: '新增'
    }, {
      id: 'adminManage-view',
      pId: 'adminManage',
      name: '查看'
    }, {
      id: 'adminManage-edit',
      pId: 'adminManage',
      name: '修改'
    }, {
      id: 'adminManage-del',
      pId: 'adminManage',
      name: '删除'
    }, {
      id: 'groupManage',
      pId: 'systemManage',
      name: '权限组管理',
      open: true
    }, {
      id: 'groupManage-add',
      pId: 'groupManage',
      name: '新增'
    }, {
      id: 'groupManage-view',
      pId: 'groupManage',
      name: '查看'
    }, {
      id: 'groupManage-edit',
      pId: 'groupManage',
      name: '修改'
    }, {
      id: 'groupManage-del',
      pId: 'groupManage',
      name: '删除'
    }, {
      id: 'filesManage',
      pId: 'systemManage',
      name: '文件管理',
      open: true
    }, {
      id: 'filesManage-view',
      pId: 'filesManage',
      name: '查看'
    }, {
      id: 'filesManage-del',
      pId: 'filesManage',
      name: '删除'
    }, {
      id: 'dataManage',
      pId: 'systemManage',
      name: '数据管理',
      open: true
    }, {
      id: 'backupsMange',
      pId: 'dataManage',
      name: '备份管理',
      open: true
    }, {
      id: 'backupsMange-add',
      pId: 'backupsMange',
      name: '备份'
    }, {
      id: 'backupsMange-del',
      pId: 'backupsMange',
      name: '删除'
    }, {
      id: 'backupsMange-re',
      pId: 'backupsMange',
      name: '恢复'
    }, {
      id: 'logManage',
      pId: 'systemManage',
      name: '日志管理',
      open: true
    }, {
      id: 'logManage-view',
      pId: 'logManage',
      name: '查看'
    }, {
      id: 'sendMail',
      pId: 'systemManage',
      name: '发送系统邮件'
    }]
    return {
      getTree: function() {
        return powerModal;
      },
      getModal: function() {
        var modal = {}
        for (var i = 0, len = powerModal.length; i < len; i++) {
          if (!powerModal[i].open) {
            modal[powerModal[i].id] = false;
          }
        }
        return modal;
      }
    }
  })
  //树组件
  .directive('powerTree', ['powerModal', function(powerModal) {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        $scope[attrs.modal] = powerModal.getModal();
        //解构目录
        function eachGroup(nodes, status) {
          for (var i = 0, len = nodes.length; i < len; i++) {
            if (nodes[i].open) {
              eachGroup(nodes[i].children, status)
            } else {
              $scope.$apply(function() {
                $scope[attrs.modal][nodes[i].id] = status;
              })
            }
          }
        }

        var setting = {
          data: {
            key: {
              title: 't'
            },
            simpleData: {
              enable: true
            }
          },
          check: {
            enable: attrs.powerTree
          },
          callback: {
            onCheck: function(event, treeId, treeNode) {
              if (treeNode.checked) {
                //选中
                if (treeNode.open) {
                  eachGroup(treeNode.children, true);
                } else {
                  $scope.$apply(function() {
                    $scope[attrs.modal][treeNode.id] = true;
                  })
                }
              } else {
                //移除
                if (treeNode.open) {
                  eachGroup(treeNode.children, false);
                } else {
                  $scope.$apply(function() {
                    $scope[attrs.modal][treeNode.id] = false;
                  })
                }
              }
            }
          }
        };
        $.fn.zTree.init($('.ztree'), setting, powerModal.getTree());
      }
    };
  }])
  .factory('db', function() {
    return {
      get: function(key) {
        var data = window.localStorage[key] || '';
        return data;
      },
      set: function(key, data) {
        if (typeof(data) == 'object') {
          window.localStorage[key] = data;
          for (item in data) {
            window.localStorage[item] = data[item];
          }
        } else {
          window.localStorage[key] = data;
        }
      },
      remove: function(key) {
        window.localStorage.removeItem(key);
      }
    }
  })
  .filter('calltype', function() {
    return function(str) {
      switch (parseInt(str)) {
        case 0:
          return '微信';
          break;
        case 1:
          return 'QQ';
          break;
        case 2:
          return '电话';
          break;
        default:
          return '未知'
      }
    }
  })
  .filter('category', function() {
    return function(str) {
      console.log(str)
      return str.split(' ')[str.split(' ').length - 1];
    }
  })
  .directive('uploadimg', ['$rootScope', function($rootscope) {
    return {
      restrict: 'ECAM',
      template: '<div id="uploader" class="wu-example"><div class="uploader-list"><div id="thelist"><li ng-repeat="item in uploadList track by $index" id="{{item.id}}" class="file-item thumbnail" ng-class="{success:item.tmp}"><i class="ion-ios-close" ng-click="delUploadImg(item)"></i><img ng-src="{{item.url}}"><div class="info">{{item.name}}</div></li></div><div class="btns" ng-show="allowUpload"><div id="picker"><i class="ion-ios-plus-empty"></i><p>选择图片</p></div></div></div></div>',
      replace: true,
      link: function(scope, element, attrs) {
        var limit = parseInt(attrs.limit) || 1;
        var type = attrs.type || 'add';
        scope.allowUpload = true;
        var length = 0;
        //图片部分处理
        var uploader = WebUploader.create({
          // 选完文件后，是否自动上传。
          auto: true,
          // swf文件路径
          swf: '/lib/fex-webuploader/dist/Uploader.swf',
          // 文件接收服务端。
          server: '/api/uploadimg',
          // 选择文件的按钮。可选。
          // 内部根据当前运行是创建，可能是input元素，也可能是flash.
          pick: {
            id: '#picker',
            multiple: false
          },
          //压缩配置
          compress: {
            // 图片质量，只有type为`image/jpeg`的时候才有效。
            quality: 90,
            // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
            allowMagnify: false,
            // 是否允许裁剪。
            crop: false,
            // 是否保留头部meta信息。
            preserveHeaders: true,
            // 如果发现压缩后文件大小比原来还大，则使用原来图片
            // 此属性可能会影响图片自动纠正功能
            noCompressIfLarger: false,
            // 单位字节，如果图片大小小于此值，不会采用压缩。
            compressSize: 10000
          },
          //只允许选择图片文件。
          accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png,webp,gif',
            mimeTypes: 'image/*'
          },
          //队列限制
          fileNumLimit: 8,
          //去重
          duplicate: true
        });
        //scope.$watch('uploadList',function(){console.log(scope.uploadList)},true)
        // 当有文件添加进来的时候
        uploader.on('fileQueued', function(file) {
          var model = {
            id: file.id,
            name: file.name,
            tmp: '',
            url: ''
          };
          scope.$apply(function() {
            scope.uploadList[file.id] = model;
          })
          length++;
          // 创建缩略图
          // 如果为非图片文件，可以不用调用此方法。
          // thumbnailWidth x thumbnailHeight 为 100 x 100
          uploader.makeThumb(file, function(error, src) {
            if (!error) {
              scope.$apply(function() {
                scope.uploadList[file.id]['url'] = src
              })
            }
          }, 100, 100);
        });
        scope.delUploadImg = function(item) {
          if (type === 'add') {
            $.post('/api/delImgTmp?url=' + item.tmp, function(data) {
              var status = data.status.split('::')[0],
                msg = data.status.split('::')[1];
              if (status === 'SUCCESS') {
                alert(msg);
                scope.$apply(function() {
                  delete scope.uploadList[item.id];
                })
              } else {
                alert(msg);
              }
            })
          }
          if (type === 'edit') {
            $.post('/api/delImg?url=' + item.url, function(data) {
              var status = data.status.split('::')[0],
                msg = data.status.split('::')[1];
              if (status === 'SUCCESS') {
                alert(msg);
                scope.$apply(function() {
                  delete scope.uploadList[item.id];
                })
              } else {
                alert(msg);
              }
            })
          }
        };
        // 文件上传过程中创建进度条实时显示。
        uploader.on('uploadSuccess', function(file, req) {
          if (req.status.split('::')[0] === 'SUCCESS') {
            scope.$apply(function() {
              scope.uploadList[file.id]['tmp'] = req.tmp;
            })
            if (length >= limit) {
              scope.$apply(function() {
                scope.allowUpload = false;
              })
            }
          } else {
            alert(file.name + '上传失败')
            scope.$apply(function() {
              delete scope.uploadList[file.id];
            })
            length--;
          }
        });
      }
    }
  }])
  .directive('editormd', ['$rootScope', function($rootscope) {
    return {
      restrict: 'ECAM',
      template: '<div id="editormd"><textarea style="display:none;"></textarea></div>',
      replace: true,
      link: function(scope, element, attrs) {
        scope.editor = editormd('editormd', {
          path: '/lib/editor.md/lib/', // Autoload modules mode, codemirror, marked... dependents libs path
          height: 300,
          watch: false,
          imageUpload: false,
          toolbarIcons: function() {
            return ['undo', 'redo', '|', 'bold', 'del', 'italic', 'quote', 'ucwords', 'uppercase', 'lowercase', '|', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', '|', 'list-ul', 'list-ol', 'hr', '|', 'goto-line', 'watch', 'preview', 'fullscreen', 'clear', '|', 'help']
          }
        });
      }
    }
  }])
  .provider('$nestable', function() {
    var modelName = '$item';
    var defaultOptions = {};

    this.$get = function() {
      return {
        modelName: modelName,
        defaultOptions: defaultOptions
      };
    };

    /**
     * Method to set model variable for nestable elements
     * @param  {[string]} value
     */
    this.modelName = function(value) {
      modelName = value;
    };

    /**
     * Method to set default nestable options
     * @param  {[object]} value
     * You can change the follow options:

      maxDepth        : number of levels an item can be nested (default 5)
      group           : group ID to allow dragging between lists (default 0)

      listNodeName    : The HTML element to create for lists (default 'ol')
      itemNodeName    : The HTML element to create for list items (default 'li')
      rootClass       : The class of the root element .nestable() was used on (default 'dd')
      listClass       : The class of all list elements (default 'dd-list')
      itemClass       : The class of all list item elements (default 'dd-item')
      dragClass       : The class applied to the list element that is being dragged (default 'dd-dragel')
      handleClass     : The class of the content element inside each list item (default 'dd-handle')
      collapsedClass  : The class applied to lists that have been collapsed (default 'dd-collapsed')
      placeClass      : The class of the placeholder element (default 'dd-placeholder')
      emptyClass      : The class used for empty list placeholder elements (default 'dd-empty')
      expandBtnHTML   : The HTML text used to generate a list item expand button (default '<button data-action="expand">Expand></button>')
      collapseBtnHTML : The HTML text used to generate a list item collapse button (default '<button data-action="collapse">Collapse</button>')

     */
    this.defaultOptions = function(value) {
      defaultOptions = value;
    };
  })
  .directive('ngNestable', ['$compile', '$nestable', function($compile, $nestable) {
    return {
      restrict: 'A',
      require: 'ngModel',
      compile: function(element) {
        var itemTemplate = element.html();
        element.empty();
        return function($scope, $element, $attrs, $ngModel) {
          var options = $.extend({},
            $nestable.defaultOptions,
            $scope.$eval($attrs.ngNestable)
          );
          $scope.$watch(function() {
            return $ngModel.$modelValue;
          }, function(model) {
            if (model) {
              /**
               * we are running the formatters here instead of watching on $viewValue because our model is an Array
               * and angularjs ngModel watcher watches for "shallow" changes and otherwise the possible formatters wouldn't
               * get executed
               */
              model = runFormatters(model, $ngModel);
              // TODO: optimize as rebuilding is not necessary here
              var root = buildNestableHtml(model, itemTemplate);
              $element.empty().append(root);
              $compile(root)($scope);
              root.nestable(options);
              root.on('change', function() {
                $ngModel.$setViewValue(root.nestable('serialize'));
                $scope && $scope.$root && $scope.$root.$$phase || $scope.$apply();
              });
            }
          },true);
        };
      },
      controller: angular.noop
    };

    function buildNestableHtml(model, tpl) {
      var root = $('<div class="dd"></div>');
      var rootList = $('<ol class="dd-list"></ol>').appendTo(root);
      model.forEach(function f(item) {
        var list = Array.prototype.slice.call(arguments).slice(-1)[0];
        if (!(list instanceof $)) list = rootList;

        var listItem = $('<li class="dd-item"></li>');
        var listElement = $('<div ng-nestable-item class="dd-handle"></div>');
        listElement.append(tpl).appendTo(listItem);
        list.append(listItem);
        listItem.data('item', item.item);
        if (isArray(item.children) && item.children.length > 0) {
          var subRoot = $('<ol class="dd-list"></ol>').appendTo(listItem);
          item.children.forEach(function(item) {
            f.apply(this, Array.prototype.slice.call(arguments).concat([subRoot]));
          });
        }
      });

      return root;
    }

    function isArray(arr) {
      return Object.prototype.toString.call(arr) === '[object Array]';
    }

    function runFormatters(value, ctrl) {
      var formatters = ctrl.$formatters,
        idx = formatters.length;

      ctrl.$modelValue = value;
      while (idx--) {
        value = formatters[idx](value);
      }

      return value;
    }
  }])
  .directive('ngNestableItem', ['$nestable', function($nestable) {
    return {
      scope: true,
      require: '^ngNestable',
      link: function($scope, $element) {
        $scope[$nestable.modelName] = $($element.parent()[0]).data('item');
      }
    };
  }])
  .directive('ngPagination', function () {
    return {
      restrict: 'AE',
      template: [
  '<div class="ng-pagination">',
  '  <form ng-if="!hidePagesize" class="form-inline pull-left" ng-submit="onsizechange(fixPageSize(pagesize))">',
  '    <div class="form-group {{size ? \'form-group-\' + size : \'\'}}">',
  '      <label>每页显示</label>',
  '      <input type="number" ng-blur="onsizechange(fixPageSize(pagesize))" ng-model="pagesize" class="form-control pagesize"> 条',
  '    </div>',
  '  </form>',
  '  <ul class="pagination {{size ? \'pagination-\' + size : \'\'}} pull-left">',
  '    <li ng-click="prev()" ng-class="{disabled:+currentPage===1}">',
  '      <a aria-label="Previous">',
  '        <span aria-hidden="true">&laquo;</span>',
  '      </a>',
  '    </li>',
  '    <li ng-if="_needShow($index+1)"',
  '        ng-click="setPage($index+1)"',
  '        ng-class="{active:+currentPage===$index+1}"',
  '        ng-repeat="page in pages track by $index">',
  '      <a>{{$index+1}}</a>',
  '    </li>',
  '    <li ng-click="next()"',
  '        ng-class="{disabled:+currentPage===totalPages}">',
  '      <a aria-label="Next">',
  '        <span aria-hidden="true">&raquo;</span>',
  '      </a>',
  '    </li>',
  '  </ul>',
  '  <form class="ng-pagination-input" ng-if="!hideInput" ng-submit="setPage(inputPage)">',
  '    共{{totalPages}}页，转到第',
  '    <input type="number" class="form-control {{size ? \'input-\' + size : \'\'}}" placeholder="页码" ng-model="inputPage"> 页',
  '    <button class="btn btn-primary {{size ? \'btn-\' + size : \'\'}}" type="submit">Go</button>',
  '  </form>',
  '</div>'
  ].join(''),
      scope: {
        totalPages: '=',
        currentPage: '=?',
        aside: '=?',
        onchange: '=?',
        pagesize: '=?',
        hidePagesize: '=?',
        onsizechange: '=?',
        hideInput: '=?',
        size: '@?'
      },
      link: function (scope, elem, attrs) {
        // 初始化
        scope.currentPage = scope.currentPage || 1;
        scope.inputPage = scope.currentPage;
        scope.onchange = scope.onchange || angular.noop;
        scope.pagesize = scope.pagesize || 10;

        // 生成页辅助数组
        scope.pages = new Array(scope.totalPages);

        // 设置页码
        scope.setPage = function (page) {
          scope.currentPage = page < 1
            ? 1
            : page > scope.totalPages
              ? scope.totalPages
              : page;
        };

        // 上一页
        scope.prev = function () {
          scope.currentPage = scope.currentPage > 1 ? scope.currentPage - 1 : 1;
        };

        // 下一页
        scope.next = function () {
          scope.currentPage = scope.currentPage < scope.totalPages ? scope.currentPage + 1 : scope.totalPages;
        };

        // 限制size<500
        scope.fixPageSize = function (size) {
          scope.pagesize = size > 500
            ? 500
            : size < 1
              ? 1
              : size;
          return scope.pagesize;
        };

        // 判断当前页码是否需要显示
        scope._needShow = function (index) {
          // aside意为当前页码双侧(不计首页和尾页)各显示多少个页码
          var aside = scope.aside || 5;
          if (scope.totalPages < (aside * 2 + 3)) {
            return true;
          }
          var offset = scope.currentPage < (aside + 1)
            ? aside - scope.currentPage + 1
            : scope.currentPage > (scope.totalPages - aside)
              ? (scope.totalPages - scope.currentPage - aside)
              : 0;
          return ((index >= scope.currentPage - aside + offset) && (index <= scope.currentPage + aside + offset))
                 || (index === 1)
                 || (index === scope.totalPages);
        };
        // 页码变化触发onchange事件
        scope.onsizechange = function(){
          scope.pagesize = scope.fixPageSize(scope.pagesize);
          var search = window.location.search ? URL.parse(window.location.search) : {};
          search.page = scope.currentPage;
          search.limit = scope.pagesize;
          window.location.href = window.location.pathname + '?' + URL.format(search);
        }
        // 页码变化触发onchange事件
        scope.$watch('currentPage', function (currentPage, originalPage) {
          if (currentPage != originalPage) {
            var search = window.location.search ? URL.parse(window.location.search) : {};
            search.page = currentPage;
            search.limit = scope.pagesize;
            window.location.href = window.location.pathname + '?' + URL.format(search);
            scope.inputPage = scope.currentPage;
          }
        });

        // 总页数变化触发事件
        scope.$watch('totalPages', function () {
          scope.pages = new Array(scope.totalPages);
        });
      }
    };
  });