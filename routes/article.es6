import router from 'koa-router';
import render from './../utils/render';
import articlesModel from './../models/Articles';
import marked from 'marked';

let R = router();

R.get('/:id', function *(next) {
  let article = yield articlesModel.findById(this.params.id,true);
  article[0].contentHTML = marked(article[0].content);
  yield render('article',{
    title: article[0].title,
    desc:'',
    data:article[0]
  },this);
});

export default R;
