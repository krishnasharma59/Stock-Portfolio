import mongoose from "../config/connection.db.js";

// user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50   
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        match: [
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/
        ],
        required: true
    },

    //OTP (for forgot password)
    resetOtp: {
        type: String,
        default: null
    },

    //OTP expiry
    otpExpiry: {
        type: Date,
        default: null
    },

    //Track if OTP is verified
    isOtpVerified: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true 
});

// export model
export default mongoose.model("user", userSchema);