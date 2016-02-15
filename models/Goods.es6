/**
 * Created by Chinakids on 16/2/14.
 * Goods.es6 :: 商品的model文件
 */

import mongoose from 'mongoose';
import GoodSchema from './schemas/Goods';

const Goods = mongoose.model('Goods',GoodSchema);

export default Goods;
