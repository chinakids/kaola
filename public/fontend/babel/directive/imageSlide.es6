const directive = [
  'imageSlide',
  [
    '$window',
    '$document',
    ($win, $doc) => {
      return {
        restrict: 'EMAC',
        replace:true,
        template:`
          <div class='row margin-bottom image-box' ng-if='remove'>
            <div class='col-sm-8'>
              <div class='big-img'><img class='img-responsive' ng-src='{{showImage.url}}' alt='Photo'/></div>
            </div>
            <div class='col-sm-4'>
              <div class='row'>
                <div class='col-xs-6'>
                <div class='small-img' ng-repeat='item in leftData track by $index'><img class='img-responsive' ng-src='{{item.url}}' ng-click='show(item)' alt='Photo'/></div>
                </div>
                <div class='col-xs-6'>
                <div class='small-img' ng-repeat='item in rightData track by $index'><img class='img-responsive' ng-src='{{item.url}}' ng-click='show(item)' alt='Photo'/></div>
                </div>
              </div>
            </div>
          </div>
        `,
        controller:['$scope',($scope)=>{
          $scope.rightData = [];
          $scope.leftData = [];
          $scope.remove = true;
          $scope.showImage = '';
          $scope.show = (obj) => {
            $scope.showImage = obj;
          }
        }],
        link($scope, $elem, attrs) {
          let data = JSON.parse(attrs.data);
          let index = 1;
          for (let item in data) {
            if(index === 1) $scope.showImage = data[item];
            if(index%2 === 0){
              $scope.rightData.push(data[item])
            }else{
              $scope.leftData.push(data[item])
            }
            index++;
          }
          if(index === 1) $scope.remove = false;
        }
      }
    }
  ]
];
export default directive;
