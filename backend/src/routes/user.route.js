import express from "express";
import { getUser, updateProfile, userLogin, userLogout, userSignup } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/signup", userSignup);
router.post("/login", userLogin);
router.post("/logout", userLogout);

router.put('/update-profile', authMiddleware, updateProfile);

router.get('/getuser', authMiddleware, getUser);

export default router;