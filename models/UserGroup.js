import mongoose from 'mongoose';
import UserGroupSchema from './schemas/UserGroup';

const UserGroup = mongoose.model('UserGroup',UserGroupSchema)

exports default UserGroup;
