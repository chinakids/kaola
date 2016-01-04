import fs from 'fs';
import _ from 'underscore';
import path from 'path';
import jade from 'jade';
import logger from './logger';
import templateModel from './../models/Template';
/**
 * [TemplateCache 缓存jade页面为jade-runtime]
 */


let pages = {};

function forPage(){
  let views = path.join(__dirname, './../views');
  let dirList = fs.readdirSync(views);
  dirList.forEach((item) => {
    if(!fs.statSync(views + '/' + item).isDirectory()){
      if(item.indexOf('.jade') !== -1){
        pages[item.split('.')[0]] = item;
      };
    };
  });
  compileRenderService();
};

function compileRenderService(){
  for(let name in pages){
    preCompile(path.join(__dirname,'./../views/'+pages[name]), name);
  };
};

function preCompile(filePath, pageName){
  templateModel.findByName(pageName, (err,templates) => {
    if(err){
      logger('model',err);
    }else{
      //判断用户是否存在
      if(templates.length<=0){
        let _template = new templateModel({
          name      : pageName,
          content   : jade.compileFileClient(filePath)
        })
        _template.save((err, template) => {
          if(err){
            logger('model',err);
          }else{
            logger('template',`${pageName}-[初次]编译成功`)
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
            logger('template',`${template.name}-[更新]编译成功`);
          };
        });
      };
    };
  });
};

export default forPage;
