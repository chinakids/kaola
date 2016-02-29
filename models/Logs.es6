import mongoose from 'mongoose';
import LogSchema from './schemas/Logs';

const Logs = mongoose.model('Logs',LogSchema)

export default Logs;
