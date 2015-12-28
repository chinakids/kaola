import mongoose from 'mongoose';
import UserSchema from './schemas/Users';

const User = mongoose.model('User',UserSchema)

export default User;
