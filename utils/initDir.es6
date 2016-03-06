import fs from 'fs';
import path from 'path';
/**
 * [initDir 初始化目录]
 */
let initDir = (cb) => {
	const dir = [
		'.tmp',
		'.bak',
		'public/upload',
		'public/upload/goods',
		'public/upload/articles',
		'public/upload/avatar',
		'views/.cache',
		'views/.cache/fontend',
		'views/.cache/backend'
	]

	for(let i = 0,len = dir.length;i<len;i++){
		if(!fs.existsSync(path.join(process.cwd(), dir[i]))){
		  fs.mkdirSync(path.join(process.cwd(), dir[i]));
		};
	}

	if(cb) cb();
}

export default initDir;