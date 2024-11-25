import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.model.js';

export const authMiddleware = async(req, res, next) => {
    
    try {
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({ error: true, message: "Unauthorized Access - No Token Provided" })
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

        if(!decoded){
            return res.status(401).json({ error: true, message: "Unauthorized Access - Invalid Token" })
        }

        const user = await userModel.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({ error: true, message: "User Not Found" })
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};