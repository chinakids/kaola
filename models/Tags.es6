import mongoose from 'mongoose';
import TagsSchema from './schemas/Tags';

const Tags = mongoose.model('Tags',TagsSchema)

export default Tags;
