import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';

import path from 'path';

import { app, server } from './utils/socket.js'
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

const __dirname = path.resolve();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

import userRoutes from './routes/user.route.js';
import messageRoutes from './routes/message.route.js';

import { connectDB } from "./utils/db.js";


// user routes 
app.use('/v1/user', userRoutes);

// message routes 
app.use('/v1/messages', messageRoutes);



const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

server.listen(PORT, () => {
    console.log(`server is started on PORT: ${PORT}`);
    connectDB();
});