/**
 * [categoryFactory 用来处理类目数据的构建/解构]
 */

let categoryFactory = {
	//将数组组成前端可用的层级对象
	construct(obj){
		let arr = [];
		//目前只做深度2的解析
    for(let i=0,len=obj.length;i<len;i++){
      if(obj[i].parent && obj[i].parent !== 'root'){
      	//因为小数排序好了，直接填充进arr末位的children就行了
      	arr[arr.length - 1].children.push({
      		item:{
	      		name:obj[i].name,
	      		alias:obj[i].alias,
	      		_id:obj[i]._id
	      	}
      	})
      }else{
      	arr.push({
	      	item:{
	      		name:obj[i].name,
	      		alias:obj[i].alias,
	      		_id:obj[i]._id
	      	},
	      	children:[]
	      })
      }
    }
    return arr;
	},
	//解析成可以递归save的数组
	parse(obj){
		let arr = [];
		//目前只做深度2的解析
    for(let i=0,len=obj.length;i<len;i++){
      arr.push({
      	_id:obj[i].item._id || '',
      	name:obj[i].item.name,
      	level:i,
      	alias:obj[i].item.alias,
      	parent:'root'
      })
      if(obj[i].children && obj[i].children.length>0){
      	//
      	for(let o=0,len=obj[i].children.length;o<len;o++){
	      	arr.push({
	      		_id: obj[i].children[o].item._id || '',
		      	name:obj[i].children[o].item.name,
		      	level:parseFloat(`${i}.${o+1}`), //小数保存方便查询时直接排序，小数从1记序
		      	alias:obj[i].children[o].item.alias,
		      	parent:obj[i].item.alias
		      })
	      }
      }
    }
    return arr;
	}
}

export default categoryFactory;