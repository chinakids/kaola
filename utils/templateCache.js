import fs from 'fs';
import _ from 'underscore';
import path from 'path';
import jade from 'jade';
import logger from './logger';
import TemplateModel from './../models/Template'
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
let all = 0;

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
// 通过map实现每个页面渲染func的生成
function compileRenderService(pages){
  for(let name in pages){
    preCompile(path.join(__dirname,'./../views/'+pages[name]), name)
    all++;
  }
}
//预编译
function preCompile(filePath, pageName){
  fs.readFile(filePath, (err, jadeStr) => {
    if(err){
      logger('template',`读取文件出错: ${filePath}.jade`)
    }else{
      //compiledJade[pageName] = jade.compile(jadeStr, compileOption);
      TemplateModel.findByName(pageName, (err,templates) => {
        if(err){
          logger('model',err);
        }else{
          //判断用户是否存在
          if(templates.length<=0){
            let _template = new TemplateModel({
              name      : pageName,
              content   : jade.compile(jadeStr, compileOption)
            })
            _template.save((err, template) => {
              if(err){
                console.log(err);
                logger('model',err);
              }else{
                logger('template',`${pageName}-[初次]编译成功`)
              }
            })
          }else{
            let _template = {
              content : jade.compile(jadeStr, compileOption)
            }
            let newTemplate = _.extend(templates[0],_template);
            newTemplate.compiled = newTemplate.compiled + 1;
            newTemplate.save((err,template) => {
              if(err){
                logger('model',err);
              }else{
                logger('template',`${template.name}-[更新]编译成功`);
              }
            })
          }
        }
      })
      done++;
      if(done >= all) logger('template','全部更新完成')
    }
  })
}

export default forPage;
