import User from "../models/user.js"
import bcrypt from "bcrypt";
import { sendOtp } from "../services/sendOtp.js";
import Verification from "../models/verification.js"
import { genToken } from "../services/auth.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import { gemResponse } from "../gemini.js";
import moment from "moment"

export const sendCode = async (req, res) => {
    try {
        const { email } = req.body;

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "Email already exists" })
        }

        // generating otp and sending to user for email verification
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
        const s = await sendOtp(email, code);

        await Verification.findOneAndUpdate(
            { email },
            { code, expiresAt, isVerified: false },
            { upsert: true, new: true }
        );

        return res.status(201).json({ success: true, message: "OTP send successfully" })
    }
    catch (error) {
        console.log(error)
    }
}


export const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        const record = await Verification.findOne({ email });


        if (!record || record.code != code || record.expiresAt < new Date()) {
            return res.status(400).json({ message: "Invalid OTP" })
        }

        record.isVerified = true;
        await record.save();

        return res.status(200).json({ success: true, message: "OTP verified Successfully" })
    }
    catch (error) {
        console.log(error);
    }
}

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const record = await Verification.findOne({ email });

        if (!record.isVerified) {
            return res.status(400).json({ message: "registration failed" });
        }



        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
        })

        user.isVerified = true;

        await user.save();

        return res.status(201).json({ success: true, message: "Registered Successfully" });
    }
    catch (error) {
        console.log(error);
    }
}


export const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Email not registered" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect Email or Password" });
        }

        // generate token for user logined
        const token = genToken(user);
        


        return res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "Lax",       // ✅ Lax allows sending across ports on localhost
            secure: false          // ✅ Keep false for HTTP
        }).status(200).json({ success: true, message: "Logined successfully" });
    }
    catch (error) {
        console.log(error)
    }
}


export const logOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ success: true, message: "Logged out Successfully" });
    }
    catch (error) {
        console.log(error);
    }
}

export const updateUser = async(req,res) => {
    try{
        const {assistantName,img} = req.body;
        let assistantImg;

        if(req.file){
            assistantImg = await uploadOnCloudinary(req.file);
        }
        else{
            assistantImg = img;
        }

        const id = req.id;
        const user = await User.findByIdAndUpdate(id,{
            assistantName,assistantImg
        },{new : true}).select("~password");

        return res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
    }

}

export const askToGemini = async(req,res) => {
    try{
        const {command} = req.body;
        const id = req.id;
        const user = await User.findById(id);
        
        const result = await gemResponse(command,user?.name,user?.assistantName);


        const jsonMatch = result.match(/{[\s\S]*}/);
        if(!jsonMatch){
            return res.status(400).json({response : "sorry,i can't understand your command"})
        }

        const gemResult = JSON.parse(jsonMatch[0]);

        const type = gemResult.type;
        switch(type){
            case 'get_time' : 
            return res.json({
                type,
                userInput : gemResult.userInput ,
                response : `current time is ${moment().format('hh:mm A')}`
            })

            case 'get_date' : 
            return res.json({
                type,
                userInput : gemResult.userInput ,
                response : `current date is ${moment().format('DD-MM-YYYY')}`
            })

            case 'get_month' : 
            return res.json({
                type,
                userInput : gemResult.userInput ,
                response : `current month is ${moment().format('MMMM')}`
            })

            case 'get_day' : 
            return res.json({
                type,
                userInput : gemResult.userInput ,
                response : `current day is ${moment().format('dddd')}`
            })

            default:
                return res.json({
                    type,
                    userInput : gemResult.userInput,
                    response : gemResult.response
                })
        }
    }
    catch (error) {
        console.log(error);
    }
}