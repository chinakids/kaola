import mongoose from 'mongoose';
import UserSchema from './schemas/Users';

const User = mongoose.model('User',UserSchema)

exports default User;
