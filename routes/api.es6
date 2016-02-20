import router from 'koa-router';
import render from './../utils/render';
import ccap from 'ccap';
import path from 'path';
import fs from 'fs';
import parse from 'co-busboy';
import { checkingAccess , checkingLogin } from './../controller/getAccess';

let securityCode = ccap({
  'width':214,
  'height':68,
  'offset':30,
  'fontsize':45
});

let R = router();

//验证码
R.get('/securityCode',function *(next) {
  let arry = securityCode.get();
  this.session.ccap = arry[0];
  this.body = arry[1];
});

//上传图片,目前只做单张上传
R.post('/uploadImg', checkingLogin, function *(next) {
  // multipart upload
  let parts = parse(this, {
    autoFields:true
  });
  let part;
  if (part = yield parts) {
  	if(part.mimeType.split('/')[0] === 'image'){
  		let tmp = Date.parse(new Date()) + Math.random().toString().substr(0,10) + path.extname(part.filename);
	  	let stream = fs.createWriteStream(path.join(process.cwd() + '/.tmp', tmp));
		  part.pipe(stream);
		  this.body = {
		  	status: 'SUCCESS::上传成功',
		  	tmp : tmp
		  }
  	}else{
  		this.body = {
		  	status: 'FAIL::本接口只可上传图片'
		  }
  	}
  }else{
  	this.body = {
	  	status: 'FAIL::接口出错'
	  }
  }
});
//删除缓存
R.post('/delImgTmp', checkingLogin, function *(next) {
  let query = this.request.query;
  if(fs.existsSync(path.join(process.cwd() + '/.tmp', query.url))) fs.unlinkSync(path.join(process.cwd() + '/.tmp', query.url));
  this.body = {
  	status: 'SUCCESS::删除成功'
  }
});


export default R;
