import mongoose from 'mongoose';
import UserLikeSchema from './schemas/UserLike';

const UserLike = mongoose.model('UserLike',UserLikeSchema)

export default UserLike;
