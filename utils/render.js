import fs from 'fs';
import path from 'path';
import jade from 'jade';
import logger from './logger'
/**
 * [render 返回页面的方法]
 */
let pages = {};
let compiledJade = {};
let compileOption = {
  filename: path.join(__dirname,'./../views/layout')
}

let render = {};
let done = 0;
let all = undefined;

//递归创建页面方法
function forPage(){
  let views = path.join(__dirname, './../views');
  let dirList = fs.readdirSync(views);
  dirList.forEach(function(item){
    if(!fs.statSync(views + '/' + item).isDirectory()){
      if(item.indexOf('.jade') !== -1){
        pages[item.split('.')[0]] = item;
      }
    }
  })
  compileRenderService(pages);
}

// res发送html字符串
function sendPage(this, html){
  this.body = html;
}
// 通过map实现每个页面渲染func的生成
function compileRenderService(pages){
  let done = 0
  let all = 0
  for(name in pages){
    preCompile(path.join(__dirname,'./../views/'+pages[name]), name)
    all++;
  }
}
function preCompile(filePath, pageName){
  //console.log(filePath);
  // fs.readFile( path.join( viewPathSet.viewer, p+'.jade' ), function( err, jadeStr ){
  fs.readFile(filePath, (err, jadeStr) => {
    if(err){
      logger('template',`read jade file err: ${filePath}.jade`)
    }else{
      compiledJade[pageName] = jade.compile(jadeStr, compileOption)
      render[pageName] = function(res, data){
        html = compiledJade[pageName](data);
        sendPage(res, html)
      }
      done++;
      if(done >= all) logger('template','\n* re compile jade views')
    }
  })
}

forPage()

export default render;
