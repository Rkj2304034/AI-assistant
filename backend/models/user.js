import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    email : {
        type : String,
        // unique : true,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    assistantName : {
        type : String,
    },
    assistantImg : {
        type : String,
    },
    isVerified : {
        type : Boolean,
        default : false
    },
},{timestamps : true})

const User = mongoose.model("User",userSchema);

export default User;