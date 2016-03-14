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
      let getFirstImage = (list) => {
        for(let item in list){
          return list[item].url;
          break;
        }
      }
      let addMasonry = (data) => {
        let html = []
        for (let i = 0, len=data.length; i<len; i++) {
          let template = `
            <li class='grid-item'>
              <div class='img-box'>
                <a class='img' href='#'>
                  <img src='${getFirstImage(JSON.parse(data[i].imgList))}' onload='RM()'/>
                </a>
                <p class='num'>
                  <a class='watch-num' href='javascript:;'>
                    <i class='fa fa-eye'></i> ${data[0].statistics.view}
                  </a>
                  <a class='like-num' href='javascript:;'>
                    <i class='fa fa-heart'></i> ${data[0].statistics.like}
                  </a>
                </p>
              </div>
              <div class='clearfix'>
                <a class='img-name' href='#'>${data[0].title}</a>
                <p class='sort'>
                  <i class='fa fa-location-arrow'></i> ${data[0].info.location}
                </p>
                <a class='method clefafix' href='#'>
                  <span style='background-image:url(${data[0].author.avatar});'></span>
                  <b>${data[0].author.nickName}</b>
                </a>
              </div>
            </li>`;
          html.push(template);
          $('.js-masonry').append(html.join(''));
          window.M.reloadItems();
        };
      }
      addMasonry(window.list);
    }
  ]
];
export default controller;