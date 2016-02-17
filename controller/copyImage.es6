import fs from 'fs';
import path from 'path';

function copyImage(oldList,type){
	let newList = oldList;
	for(let item in newList){
		newList[item] = newList[item];
		if(newList[item].url.indexOf('data:image/jpeg;base64') !== -1){
			let oldPath = path.join(process.cwd() + '/.tmp', newList[item].tmp);
			let newPath = path.join(process.cwd() + '/public/upload/'+type, newList[item].tmp);
			fs.renameSync(oldPath,newPath);
			newList[item].url = path.join('/public/upload/'+type, newList[item].tmp);
		}
	}
	console.log(newList)
	return JSON.stringify(newList);
}

export default copyImage;