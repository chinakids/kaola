import fs from 'fs';
import path from 'path';

function copyImage(oldList,type){
	let newList = {};
	for(let item in oldList){
		newList[oldList[item].tmp.replace(/\./g,'')] = oldList[item];
		if(oldList[item].url.indexOf('data:image/jpeg;base64') !== -1){
			let oldPath = path.join(process.cwd() + '/.tmp', oldList[item].tmp);
			let newPath = path.join(process.cwd() + '/public/upload/'+type, oldList[item].tmp);
			fs.renameSync(oldPath,newPath);
			newList[oldList[item].tmp].id = oldList[item].tmp;
			newList[oldList[item].tmp].url = path.join('/upload/'+type, oldList[item].tmp);
		}
	}
	console.log(newList)
	return JSON.stringify(newList);
}

export default copyImage;