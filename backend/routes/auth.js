import express from "express";
import { getAuthUser } from "../services/auth.js";
import { isAuthenticated } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
const authRouter = express.Router();

authRouter
.get("/auth-user",isAuthenticated, getAuthUser)

export default authRouter;