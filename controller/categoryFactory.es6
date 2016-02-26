/**
 * [categoryFactory 用来处理类目数据的构建/解构]
 */

let categoryFactory = {
	//将数组组成前端可用的层级对象
	construct(obj){
		let arr = [];
		//目前只做深度2的解析
    //要做个排序函数明天写
	},
	//解析成可以递归save的数组
	parse(obj){
		let arr = [];
		//目前只做深度2的解析
    for(var i=0,len=obj.length;i<len;i++){
      arr.push({
      	name:obj[i].item.name,
      	levels:i,
      	alias:obj[i].item.alias,
      	parent:'root'
      })
      if(obj[i].children && obj[i].children.length>0){
      	for(var o=0,len=obj[i].children.length;o<len;o++){
	      	arr.push({
		      	name:obj[i].children[o].item.name,
		      	levels:0,
		      	alias:obj[i].children[o].item.alias,
		      	parent:obj[i].item.alias
		      })
	      }
      }
    }
    return arr;
	}

}

export default copyImage;