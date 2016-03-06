import fs from 'fs';
import path from 'path';
/**
 * [initDir 初始化目录]
 */
let initDir = (cb) => {
	const dir = [
		'.tmp', //文件缓存目录
		'.bak', //数据库备份目录
		'public/upload', //上传目录
		'public/upload/goods', //商品上传目录
		'public/upload/articles', //文章上传目录
		'public/upload/avatar', //头像上传目录
		'views/.cache', //模板缓存目录
		'views/.cache/fontend', //前端模板缓存目录
		'views/.cache/backend' //后端模板缓存目录
	];

	for(let i = 0,len = dir.length;i<len;i++){
		if(!fs.existsSync(path.join(process.cwd(), dir[i]))){
		  fs.mkdirSync(path.join(process.cwd(), dir[i]));
		};
	}

	if(cb) cb();
}

export default initDir;