/**
 * [getPageCount 获取分页信息]
 */

function getPageCount(count,page = 1,limit = 10){
  return {
    count : count,
    totalPage : Math.ceil(count / limit),
    limit : limit,
    page : page,
  }
}

export default getPageCount;
