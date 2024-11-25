import { userModel } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/utilities.js";
import cloudinary from "../utils/cloudinary.js";


export const userSignup = async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res.status(400).json({ error: true, message: "username is required!" });
    }

    if (!email) {
        return res.status(400).json({ error: true, message: "email is required!" });
    }

    if (!password) {
        return res.status(400).json({ error: true, message: "password is required!" });
    }

    if (password < 8) {
        return res.status(400).json({ error: true, message: "password must be at least 8 characters" });
    }

    try {

        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User Already Exists." })
        }

        const hashedPassword = await bcrypt.hash(password, 5);

        const newUser = await userModel.create({
            email: email,
            fullName: fullName,
            password: hashedPassword
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            return res.status(201).json({
                error: false, message: "Signup Successfull",
                userId: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
        } else {
            return res.status(400).json({ error: true, message: "Invalid user data" })
        };

    } catch (error) {
        console.log("Error While Signing Up: ", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    };

};



export const userLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ error: true, message: "email is required!" });
    }

    if (!password) {
        return res.status(400).json({ error: true, message: "password is required!" });
    }

    if (password < 8) {
        return res.status(400).json({ error: true, message: "password must be at least 8 characters" });
    }

    try {

        const user = await userModel.findOne({
            email: email
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" })
        };

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid Credentials" })
        };

        generateToken(user._id, res);

        res.status(201).json({
            error: false, message: "Login Successfull",
            userId: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });

    } catch (error) {
        console.log("Error While Logging In: ", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    };

};

export const userLogout = async(req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ error: false, message: "Logged Out Successfully" });
        
    } catch (error) {
        console.log("Error While Logging out: ", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};


export const updateProfile = async(req, res) => {
    try {
        const { profilePic } = req.body;

        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({ error: true, message: "Profile pic is required!" });
        }

        const uploadPic = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await userModel.findByIdAndUpdate(userId, 
            { profilePic: uploadPic.secure_url }, 
            { new: true });

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error While Uploading Profile Picture: ", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};


export const getUser = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error While getting user info: ", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};