import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const genToken = (user) => {
    const tokenData = {
        userId : user._id,
    }

    const token = jwt.sign(tokenData,process.env.JWT_SECRET_KEY);

    return token;
}

export const getUser = (token) => {
    if(!token) return null;

    const user = jwt.verify(token,process.env.JWT_SECRET_KEY);

    return user;
}


export const getAuthUser = async(req,res) => {
    try{
        const uId = req.id;
        const user = await User.findById(uId).select("-password");
        
        if(!user){
            return res.status(404).json({message : "User not found"});
        }
        console.log(user);

        return res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
    }
}