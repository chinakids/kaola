angular.module('Kaola.tools',[])
.filter('md5',function(){
  return function(str){
    if(CryptoJS){
      return CryptoJS.MD5(str).toString();
    }else {
      return false;
    }
  }
})
//input正则验证，除预置验证外，也可自己传入正则
.directive('reg',['$rootScope',function($rootscope){
  return{
    restrict : 'A',
    link:function(scope,element,attrs){
      var _ele=element[0],
        _reg=attrs.reg.toLowerCase(),
        _errTip=attrs.errTip,
        dataType = {
          '*':/[\w\W]+/, //不为空
          '*6-16':/^[\w\W]{6,16}$/, //6-16位任意字符
          'n':/^\d+$/,  //数字
          'n6-16':/^\d{6,16}$/,  //6-16位数字
          's':/^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]+$/,  //不允许特殊字符
          's6-18':/^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]{6,18}$/, //不包含特殊字符的6-18位任意
          's1-6':/^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]{1,6}$/, //不包含特殊字符的1-6位任意
          'nick':/^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]{1,12}$/, //不包含特殊字符的1-12位任意,昵称
          'p':/^[0-9]{6}$/,  //邮政编码
          'm':/^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/,  //手机号码
          'e':/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,  //邮箱
          'url':/^(\w+:\/\/)?\w+(\.\w+)+.*$/   //网站
        };
        function callback(e){
          if(e == null ){
            element.removeClass('reg-success').addClass('reg-error');
            element.val('');
            element.attr('placeholder',_errTip)
          }else{
            element.removeClass('reg-error').addClass('reg-success');
          }
        }
        function blurEvent(reg){
          _ele.addEventListener('blur',function(){
            var _val = _ele.value,
              regText = dataType[reg];
            if(regText == undefined){
              var status = _val.match(eval(reg));
              callback(status);
            }else{
              var status = _val.match(regText);
              callback(status);
            };
        },false);
      }
      blurEvent(_reg);
    }
  }
}])
//input追随验证
.directive('regto',['$rootScope',function($rootscope){
  return{
    restrict : 'A',
    link:function(scope,element,attrs){
      var  _ele=element[0],
      _errTip=attrs.errTip,
      _regto=attrs.regto;
      _ele.addEventListener('blur',function(){
        var _val = _ele.value,
        _prevVal = angular.element(document.getElementById(_regto)).val();
        if(_val != _prevVal ){
          element.removeClass('reg-success').addClass('reg-error');
          element.val('');
          element.attr('placeholder',_errTip)
        }else{
          element.removeClass('reg-error').addClass('reg-success');
        }
      },false);
    }
  }
}])
.factory('powerModal',function(){
  var powerModal = [{
      id: 'systemMange',
      pId: 0,
      name: '系统管理',
      open: true
    }, {
      id: 'adminManage',
      pId: 'systemManage',
      name: '系统用户管理',
      open: true
    }, {
      id: 'adminManage.add',
      pId: 'adminManage',
      name: '新增'
    }, {
      id: 'adminManage.view',
      pId: 'adminManage',
      name: '查看'
    }, {
      id: 'adminManage.edit',
      pId: 'adminManage',
      name: '修改'
    }, {
      id: 'adminManage.del',
      pId: 'adminManage',
      name: '删除'
    }, {
      id: 'groupManage',
      pId: 'systemManage',
      name: '权限组管理',
      open: true
    }, {
      id: 'groupManage.add',
      pId: 'groupManage',
      name: '新增'
    }, {
      id: 'groupManage.view',
      pId: 'groupManage',
      name: '查看'
    }, {
      id: 'groupManage.edit',
      pId: 'groupManage',
      name: '修改'
    }, {
      id: 'groupManage.del',
      pId: 'groupManage',
      name: '删除'
    }, {
      id: 'filesManage',
      pId: 'systemManage',
      name: '文件管理',
      open: true
    }, {
      id: 'filesManage.view',
      pId: 'filesManage',
      name: '查看'
    }, {
      id: 'filesManage.del',
      pId: 'filesManage',
      name: '删除'
    }, {
      id: 'dataManage',
      pId: 'systemManage',
      name: '数据管理',
      open: true
    },{
      id: 'backupsMange',
      pId: 'backupsMange',
      name: '备份管理',
      open: true
    }, {
      id: 'backupsMange.add',
      pId: 'backupsMange',
      name: '备份'
    }, {
      id: 'backupsMange.del',
      pId: 'backupsMange',
      name: '删除'
    }, {
      id: 'logManage',
      pId: 'systemManage',
      name: '文件管理',
      open: true
    }, {
      id: 'logManage.view',
      pId: 'logManage',
      name: '查看'
    }
  ]
  return {
    get : function(){
      return powerModal;
    }
  }
})
.directive('tree',['powerModal',function(powerModal) {
  return {
    require: '?ngModel',
    restrict: 'A',
    link: function($scope, element, attrs, ngModel) {
      var setting = {
        data: {
          key: {
            title: "t"
          },
          simpleData: {
            enable: true
          }
        },
        callback: {
          onClick: function(event, treeId, treeNode, clickFlag) {
            $scope.$apply(function() {
              ngModel.$setViewValue(treeNode);
            });
          }
        }
      };
      $.fn.zTree.init(element, setting, powerModal.get());
    }
  };
}])
