import mongoose from 'mongoose';
import UserSchema from './schemas/Users';

const Users = mongoose.model('Users',UserSchema)

export default Users;
