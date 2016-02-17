import fs from 'fs';
import path from 'path';
/**
 * [initDir 初始化目录]
 */
function initDir(){
	if(!fs.existsSync(path.join(__dirname, './../public/upload'))){
	  fs.mkdirSync(path.join(__dirname, './../public/upload'));
	};
	if(!fs.existsSync(path.join(__dirname, './../views/.cache'))){
	  fs.mkdirSync(path.join(__dirname, './../views/.cache'));
	  fs.mkdirSync(path.join(__dirname, './../views/.cache/fontend'));
	  fs.mkdirSync(path.join(__dirname, './../views/.cache/backend'));
	};
	if(!fs.existsSync(path.join(__dirname, './../views/.cache/fontend'))){
	  fs.mkdirSync(path.join(__dirname, './../views/.cache/fontend'));
	};
	if(!fs.existsSync(path.join(__dirname, './../views/.cache/backend'))){
	  fs.mkdirSync(path.join(__dirname, './../views/.cache/backend'));
	};
}

export default initDir;