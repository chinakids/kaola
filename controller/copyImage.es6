import fs from 'fs';
import path from 'path';
import uploadFileModel from './../models/UploadFiles';

let copyImage = (oldList,type) => {
	let newList = {};
	if(typeof oldList === 'string') oldList = JSON.parse(oldList);
	for(let item in oldList){
		let key = oldList[item].tmp.replace(/\./g,'');
		newList[key] = oldList[item];
		if(oldList[item].url.indexOf('data:image/jpeg;base64') !== -1){
			let oldPath = path.join(process.cwd() + '/.tmp', oldList[item].tmp);
			let newPath = path.join(process.cwd() + '/public/upload/'+type, oldList[item].tmp);
			fs.renameSync(oldPath,newPath);
			newList[key].id = key;
			newList[key].url = path.join('/upload/'+type, oldList[item].tmp);
			//存入数据库
			let uploadFile = new uploadFileModel({
				name:key,
				url:newList[key].url,
				type:type,
				mimeType:'image/*'
			})
			uploadFile.add();
		}
	}
	return JSON.stringify(newList);
}

export default copyImage;