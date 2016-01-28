/**
 * [getPageCount 获取分页信息]
 */

function getPageCount(count,limit = 10){
  return {
    count : count,
    totalPage : Math.ceil(count / limit),
    limit : limit
  }
}

export default getPageCount;
