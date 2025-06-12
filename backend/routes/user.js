import express from "express"
import { askToGemini, logIn, logOut, sendCode, signUp, updateUser, verifyCode } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
const userRouter = express.Router();
import upload from "../middlewares/multer.js";

userRouter
.post("/register",signUp)
.post("/send-code",sendCode)
.post("/verify-code",verifyCode)
.post("/login",logIn)
.get("/logout",logOut)
.post("/update",isAuthenticated,upload.single("img"),updateUser)
.post("/command",isAuthenticated , askToGemini);


export default userRouter;