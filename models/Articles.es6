/**
 * Created by Chinakids on 16/2/14.
 * Goods.es6 :: 文章的model文件
 */

import mongoose from 'mongoose';
import ArticleSchema from './schemas/Articles';

const Articles = mongoose.model('Articles',ArticleSchema);

export default Articles;
