import router from 'koa-router';
import render from './../utils/render';
import ccap from 'ccap';
import path from 'path';
import fs from 'fs';
import parse from 'co-busboy';
import check from './../controller/getAccess';
import sendMail from './../utils/mail'

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
R.post('/uploadImg', check.login(), function *(next) {
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
R.post('/delImgTmp', check.login(), function *(next) {
  let query = this.request.query;
  if(fs.existsSync(path.join(process.cwd() + '/.tmp', query.url))) fs.unlinkSync(path.join(process.cwd() + '/.tmp', query.url));
  this.body = {
  	status: 'SUCCESS::删除成功'
  }
});

//清空缓存
R.post('/clearImgTmp', check.login(),check.access('filesManage-del'), function *(next) {
  //递归删除非今天的缓存
  let dir = process.cwd()+'/.tmp';
  let date = new Date();
  let time = Date.parse(new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`))
  fs.readdirSync(dir).forEach((item) => {
    if(!fs.statSync(dir + '/' + item).isDirectory()){
      if(parseInt(item.split('.')[0])/10 < time){
        fs.unlinkSync(dir + '/' + item);
      }
    };
  });
  this.body = {
    status: 'SUCCESS::清空缓存成功'
  }
});

//下载文件
R.get('/download',function *(next) {
  let query = this.request.query;
  let buffer = fs.readFileSync(process.cwd()+'/public'+query.url, ['utf-8']);
  this.attachment(query.url.split('/').pop())
  this.body = buffer;
});

//发送邮件
R.post('/sendMail', check.login(), check.access('sendMail'), function *(next) {
  let parm = this.request.body;
  yield sendMail(parm)
  this.body = {
    status: 'SUCCESS::邮件发送成功'
  }
});

export default R;
