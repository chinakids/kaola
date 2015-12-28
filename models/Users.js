import mongoose from 'mongoose';
import UserSchema from './schemas/Users';

User = mongoose.model('User',UserSchema)

exports default User;
