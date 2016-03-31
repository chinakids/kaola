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
      // let getFirstImage = (list) => {
      //   for(let item in list){
      //     return list[item].url;
      //     break;
      //   }
      // }
      // let addMasonry = (data) => {
      //   for (let i = 0, len=data.length; i<len; i++) {
      //     let template = `
      //       <li class='grid-item'>
      //         <div class='img-box'>
      //           <a class='img' href='/${data[i].info ? 'good' : 'article'}/${data[i]._id}'>
      //             <img src='${getFirstImage(JSON.parse(data[i].imgList))}' onload='RM()' onerror='this.src="fontend/img/bg/nopicture.jpg"'/>
      //           </a>
      //           <p class='num'>
      //             <a class='watch-num' href='javascript:;'>
      //               <i class='fa fa-eye'></i> ${data[i].statistics.view}
      //             </a>
      //             <a class='like-num' href='javascript:;'>
      //               <i class='fa fa-heart'></i> ${data[i].statistics.like}
      //             </a>
      //           </p>
      //         </div>
      //         <div class='clearfix'>
      //           <a class='img-name' href='/${data[i].type === 'good' ? 'good' : 'article'}/${data[i]._id}'>${data[i].title}</a>
      //           ${data[i].info ? '<p class=\'sort\'><i class=\'fa fa-location-arrow\'></i> '+data[i].info.location+'</p>' : ''}
      //           <a class='method clefafix' href='/users/${data[i].author._id}'>
      //             <span style='background-image:url(${data[i].author.avatar});'></span>
      //             <b>${data[i].author.nickName}</b>
      //           </a>
      //         </div>
      //       </li>`;
      //     $('.js-masonry').append(template);
      //     window.M.reloadItems();
      //   };
      // }
      // addMasonry(window.list);
    }
  ]
];
export default controller;