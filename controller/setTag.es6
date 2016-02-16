/**
 * [setTag 用来储存Tag,非阻塞操作]
 */

import tagModel from './../models/Tags';

function * setTag(next){
  yield next;
  let parm = this.request.body;
  let tagList = parm.tag.split(',');
  for (let i = 0,len = tagList.length; i < len; i++) {
    let tags = yield tagModel.findByName(tagList[i]);
    if (tags.length <= 0) {
      let tag = new tagModel({
        name: tagList[i]
      })
      yield tag.add()
    }else{
      tags[0].count = tags[0].count+1;
      yield tags[0].add()
    }
  };
}

export default setTag;
