import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true,

    },
    expireAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 10 * 60 * 1000)
    }

}, { timestamps: true })


// delete the opt from db after expire 

otpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })

const OTPModel = mongoose.models.OTP || mongoose.model('OTP', otpSchema, "otps")

export default OTPModel