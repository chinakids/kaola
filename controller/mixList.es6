/**
 * [mixList 用来混合排序goods/articles列表]
 */

/**
 * [列表混合排序]
 * @param  {Array}  one    [商品/文章列表]
 * @param  {Array}  two    [文章/商品列表]
 * @param  {Boolean} pn     [依据创建时间正序还是反序,默认true为正序 ]
 * @return {Array}           [混合列表]
 */
let mixList = (one, two, pn = true) => {
  let timeList = [];
  let list = [...one,...two];
  let cache = {};
  for (let i = 0, len = list.length; i < len; i++) {
    timeList.push(Date.parse(list[i].meta.createAt));
    cache[Date.parse(list[i].meta.createAt)] = list[i];
  };
  timeList = timeList.sort();
  for(let i = 0, len = timeList.length; i < len; i++){
    timeList[i] = cache[timeList[i]]
  }
  return pn ? timeList : timeList.reverse();
}


export default mixList;