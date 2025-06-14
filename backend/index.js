import express from "express";
import dotenv from "dotenv"
import connectDb from "./config/db.js";
import userRouter from "./routes/user.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import { gemResponse } from "./gemini.js";
dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : 'https://ai-assistant-frontend-hqin.onrender.com',
    credentials:true
}))

app.get("/ai", async(req,res) => {
    const prompt = req.query.prompt;
    const result = await gemResponse(prompt);
    res.send(result); 
});


app.use("/user",userRouter)
app.use("/auth",authRouter)

app.listen(PORT,() => {
    connectDb();
    console.log(`server started on port ${PORT} `)
})
