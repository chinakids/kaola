/**
 * [setTag 用来储存Tag,非阻塞操作]
 */

import tagModel from './../models/Tags';

export default function * setTag(next){
  yield next;
  let parm = this.request.body;
  let tagList = parm.tag.split(',');
  for (let i = 0,len = tagList.length; i < len; i++) {
    let [ tag ]= yield tagModel.findByName(tagList[i]);
    if (!tag) {
      let tag = new tagModel({
        name: tagList[i]
      })
      yield tag.add()
    }else{
      tag.count = tag.count+1;
      yield tag.add()
    }
  };
}
