import { messageModel } from "../models/message.model.js";
import { userModel } from "../models/user.model.js"
import cloudinary from "../utils/cloudinary.js";

import { getReceiverSocketId, io } from "../utils/socket.js";



export const getUsersForSidebar = async(req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await userModel.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error While fetching users: ", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}

export const getMessages = async(req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await messageModel.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId } 
            ]
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error While fetching messages: ", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};


export const sendMessage = async(req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new messageModel({
            senderId,
            receiverId,
            text,
            imageUrl
        });

        await newMessage.save();

        // realtime functionality using socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        
        res.status(201).json(newMessage);



    } catch (error) {
        console.log("Error While sending messages: ", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};