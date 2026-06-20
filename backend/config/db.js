import mongoose from "mongoose"

import dns from "dns"
dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

const connectDb = async(req,res) => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("mongodb connected successfully")
    }
    catch (error) {
        console.log(error)
    }
}

export default connectDb;