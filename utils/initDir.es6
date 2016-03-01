import fs from 'fs';
import path from 'path';
/**
 * [initDir 初始化目录]
 */
let initDir = () => {
	if(!fs.existsSync(path.join(process.cwd(), '.tmp'))){
	  fs.mkdirSync(path.join(process.cwd(), '.tmp'));
	};
	if(!fs.existsSync(path.join(process.cwd(), '.bak'))){
	  fs.mkdirSync(path.join(process.cwd(), '.bak'));
	};
	if(!fs.existsSync(path.join(process.cwd(), 'public/upload'))){
	  fs.mkdirSync(path.join(process.cwd(), 'public/upload'));
	  fs.mkdirSync(path.join(process.cwd(), 'public/upload/goods'));
	  fs.mkdirSync(path.join(process.cwd(), 'public/upload/articles'));
	};
	if(!fs.existsSync(path.join(process.cwd(), 'public/upload/goods'))){
	  fs.mkdirSync(path.join(process.cwd(), 'public/upload/goods'));
	};
	if(!fs.existsSync(path.join(process.cwd(), 'public/upload/articles'))){
	  fs.mkdirSync(path.join(process.cwd(), 'public/upload/articles'));
	};
	if(!fs.existsSync(path.join(process.cwd(), 'public/upload/avatar'))){
	  fs.mkdirSync(path.join(process.cwd(), 'public/upload/avatar'));
	};
	if(!fs.existsSync(path.join(process.cwd(), 'views/.cache'))){
	  fs.mkdirSync(path.join(process.cwd(), 'views/.cache'));
	  fs.mkdirSync(path.join(process.cwd(), 'views/.cache/fontend'));
	  fs.mkdirSync(path.join(process.cwd(), 'views/.cache/backend'));
	};
	if(!fs.existsSync(path.join(process.cwd(), 'views/.cache/fontend'))){
	  fs.mkdirSync(path.join(process.cwd(), 'views/.cache/fontend'));
	};
	if(!fs.existsSync(path.join(process.cwd(), 'views/.cache/backend'))){
	  fs.mkdirSync(path.join(process.cwd(), 'views/.cache/backend'));
	};
}

export default initDir;