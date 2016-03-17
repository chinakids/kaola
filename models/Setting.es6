import mongoose from 'mongoose';
import SettingSchema from './schemas/Setting';

const Setting = mongoose.model('Setting',SettingSchema)

export default Setting;
