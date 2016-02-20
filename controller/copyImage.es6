import fs from 'fs';
import path from 'path';

function copyImage(oldList,type){
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
		}
	}
	return JSON.stringify(newList);
}

export default copyImage;