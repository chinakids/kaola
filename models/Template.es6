import mongoose from 'mongoose';
import TemplateSchema from './schemas/Template';

const Template = mongoose.model('Template',TemplateSchema)

export default Template;
