const controller = [
  'ArticleCtrl',
  [
    '$scope',
    '$http',
    '$filter',
    ($scope,$http,$filter) => {
      $scope.like = id => {
        $.post(`/api/addLike?id=${id}&type=article`, {}, res => {
          let status = res.status.split('::')[0],
          msg = res.status.split('::')[1];
          if(status === 'SUCCESS'){
            toastr.success(msg)
            $('#like span').text(res.data)
          }else{
            toastr.error(msg)
          }
        })
      }
    }
  ]
];
export default controller;