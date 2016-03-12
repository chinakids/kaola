const controller = [
  'IndexCtrl',
  [
    '$scope',
    '$http',
    '$filter',
    ($scope,$http,$filter) => {
      $(window).scroll(() => {
        if($(document).scrollTop() >= 280){
          $('.navbar').removeClass('opacity')
        }else{
          $('.navbar').addClass('opacity')
        }
      })
      window.M = new Masonry('.js-masonry',{
        // options...
        itemSelector: '.grid-item',
        columnWidth: 10
      });
    }
  ]
];
export default controller;