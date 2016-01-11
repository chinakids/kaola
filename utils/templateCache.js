import fs from 'fs';
import _ from 'underscore';
import path from 'path';
import jade from 'jade';
import logger from './logger';
import templateModel from './../models/Template';
/**
 * [TemplateCache 缓存jade页面为jade-runtime]
 */


let pages = {
  backend:{},
  fontend:{}
};

function forPage(){
  //递归后台模板
  let backendViews = path.join(__dirname, './../views/backend');
  fs.readdirSync(backendViews).forEach((item) => {
    if(!fs.statSync(backendViews + '/' + item).isDirectory()){
      if(item.indexOf('.jade') !== -1){
        pages['backend'][item.split('.')[0]] = item;
      };
    };
  });
  //递归前台模板
  let fontendViews = path.join(__dirname, './../views/fontend');
  fs.readdirSync(fontendViews).forEach((item) => {
    if(!fs.statSync(fontendViews + '/' + item).isDirectory()){
      if(item.indexOf('.jade') !== -1){
        pages['fontend'][item.split('.')[0]] = item;
      };
    };
  });
  compileRenderService();
};

function compileRenderService(){
  for(let name in pages.backend){
    preCompile(path.join(__dirname,'./../views/backend/'+pages[name]), name, 'backend');
  };
  for(let name in pages.fontend){
    preCompile(path.join(__dirname,'./../views/fontend/'+pages[name]), name, 'fontend');
  };
};

function preCompile(filePath, pageName,group){
  templateModel.findByName({'name':pageName,'group':group}, (err,templates) => {
    if(err){
      logger('model',err);
    }else{
      //判断模板是否存在
      if(templates.length<=0){
        let _template = new templateModel({
          name      : pageName,
          content   : jade.compileFileClient(filePath),
          grounp    : group
        })
        _template.save((err, template) => {
          if(err){
            logger('model',err);
          }else{
            logger('template',`${grounp}-${pageName}-[初次]编译成功`)
          };
        });
      }else{
        let _template = {
          content : jade.compileFileClient(filePath)
        };
        let newTemplate = _.extend(templates[0],_template);
        newTemplate.compiled = newTemplate.compiled + 1;
        newTemplate.save((err,template) => {
          if(err){
            logger('model',err);
          }else{
            logger('template',`${grounp}-${template.name}-[更新]编译成功`);
          };
        });
      };
    };
  });
};

export default forPage;
