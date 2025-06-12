import { getUser } from "../services/auth.js";

export const isAuthenticated = (req,res,next) => {
    try{
        const token = req.cookies.token;
        console.log(token);
        if(!token){
            return res.status(401).json({message : "User not authenticated"});
        }

        const user = getUser(token);
        if(!user){
            return res.status(401).json({message : "Invalid token" })
        }

        req.id = user.userId;
        next();
    }
    catch (error) {
        console.log(error);
    }
}