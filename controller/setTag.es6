/**
 * [setTag 用来储存Tag,非阻塞操作]
 */

import tagModel from './../models/Tags';

function * setTag(next){
  yield next;
  console.log('开始处理tag')
  let parm = this.request.body;
  let tagList = parm.tag.split(',');
  for (let i = 0,len = tagList.length; i < len; i++) {
    console.log(tagList[i])
    let tags = yield tagModel.findByName(tagList[i]);
    if (tags.length <= 0) {
      console.log('新建')
      let tag = new tagModel({
        name: tagList[i]
      })
      yield tag.add()
    }else{
      console.log('已存在')
      tags[0].count = tags[0].count+1;
      yield tag[0].add()
    }
  };
}

export default setTag;
