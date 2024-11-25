import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const messageSchema = new Schema({
    senderId: { type: ObjectId, required: true, ref: 'User' },
    receiverId: { type: ObjectId, required: true, ref: 'User' },
    text: { type: String },
    image: { type: String },
    
    }, 
    { timestamps: true }
);

export const messageModel = mongoose.model('Message', messageSchema);

