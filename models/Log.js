import mongoose from 'mongoose';
import LogSchema from './schemas/Log';

const Log = mongoose.model('Log',LogSchema)

export default Log;
