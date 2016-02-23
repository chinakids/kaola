/**
 * Created by Chinakids on 16/2/23.
 * Categories.es6 :: 栏目的model文件
 */

import mongoose from 'mongoose';
import CategorySchema from './schemas/Categories';

const Categories = mongoose.model('Categories',CategorySchema);

export default Categories;
