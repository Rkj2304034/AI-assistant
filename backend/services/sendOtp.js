import nodemailer from "nodemailer";

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "rahulkumarjha2006@gmail.com",
    pass: "wgds iexh zgxf nhld",
  },
});

// Wrap in an async IIFE so we can use await.
 export const sendOtp = async(receiverEmail,otp) => {
    try{
      const info = await transporter.sendMail({
    from: '"AI-assistant" <rahulkumarjha2006@gmail.com>',
    to: `${receiverEmail}`,
    subject: "verify your Email",
    text: `${otp}`, // plain‑text body
     html: `<h3>Your OTP is: <b>${otp}</b></h3>`
  });

  return true;
}
    catch (error) {
      console.log(error);
      return false;
    }
}