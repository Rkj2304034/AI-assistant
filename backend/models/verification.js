import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date, // ✅ use Date instead of String
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Verification = mongoose.model("Verification", verificationSchema);

export default Verification;
