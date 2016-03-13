const directive = [
  'lazySrc',
  [
    '$window',
    '$document',
    ($win, $doc) => {
      let win = angular.element($win);
      let doc = $doc[0];
      let isLazyLoading = false;
      //用来维护当前需要lazyload的图片集合
      let elements = (() => {
        let _uid = 0;
        let _list = {}
        return {
          push(_data) {
            _list[_uid++] = _data;
            setTimeout(() => {
                checkImage(_data);
            });
          },
          del(key) {
            _list[key] && delete _list[key];
          },
          size() {
            return Object.keys(_list).length;
          },
          get() {
            return _list;
          }
        }
      })();
      //判断图片元素是否在可视区域内，如果超出1/3可见，则显示
      let isVisible = (elem) => {
        let rect = elem[0].getBoundingClientRect();
        let ret = true;
        if (rect.height > 0 && rect.width > 0) {
          let x = rect.top > 0 && (rect.top + rect.height / 3) < Math.max(doc.documentElement.clientHeight, win.innerHeight || 0);
          let y = rect.left > 0 && (rect.left + rect.width / 3) < Math.max(doc.documentElement.clientWidth, win.innerWidth || 0);
          ret = x && y;
        }
        return ret;
      };
      //每次scroll时，调用checkImage，循环检查图片
      let checkImage = (evt, i, item) => {
        if (i >= 0 && item) {
          return isVisible(item.elem) ? item.load(i) : false; //指定检查，返回是否显示
        } else if (elements.size() == 0) {//全部显示之后，解除绑定
          win.off('scroll', checkImage);
          win.off('resize', checkImage);
          isLazyLoading = false;
        } else {
          angular.forEach(elements.get(), (item, key) => {//循环检查
            isVisible(item.elem) && item.load(key);
          });
        }
      };
      //初始化，绑定scroll
      //如果已经全部显示了，会off，若有新的指令（ajax、js载入需要lazyload的内容），会重新绑定scroll
      let initLazyLoad = () => {
        if (isLazyLoading === false) {
          isLazyLoading = true;
          win.on('scroll', checkImage);
          win.on('resize', checkImage);
        }
      }
    return {
        restrict: 'A',//仅可以使用  attr
        scope: {},//独立的scope
        link($scope, $elem, attrs) {
          $elem[0].style.cssText && $elem.data('cssText',$elem[0].style.cssText);
          $elem.css({'min-width':'1px','min-height':'1px'});
          //传回调参数，不$watch 状态，以免增加过多
          elements.push({
            elem: $elem,
            load(key) {
              $elem.data('cssText') && ($elem[0].style.cssText = $elem.data('cssText'))
              $elem.removeClass('ng-lazyload')
              $elem.attr('src', attrs.lazySrc);
              key >= 0 && elements.del(key);
              $scope.$destroy();
              return true;
            }
          });
          initLazyLoad();
        }
      }
    }
  ]
];
export default directive;
