import mongoose from 'mongoose';
import UploadFileSchema from './schemas/UploadFiles';

const UploadFiles = mongoose.model('UploadFiles',UploadFileSchema)

export default UploadFiles;
