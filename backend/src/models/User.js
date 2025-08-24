import mongoose from 'mongoose';


const userSchema = new mongoose.Schema(
{
fullName: { type: String, trim: true },
email: { type: String, required: true, unique: true, lowercase: true, trim: true },
password: { type: String, required: true },
},
{ timestamps: true }
);


export default mongoose.model('User', userSchema);