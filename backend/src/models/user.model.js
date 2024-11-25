import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true, minlength: 8 },
    profilePic: { type: String, default: "" },
    
    }, 
    { timestamps: true }
);

export const userModel = mongoose.model('User', userSchema);

