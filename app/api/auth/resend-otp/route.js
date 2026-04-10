import { zSchema } from "@/lib/zodSchema";
import { connectDB } from "../../../../lib/db";
import { errorResponse, generateOtp, response } from "../../../../lib/helperFunction";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { sendMail } from "@/lib/sendMail";
import { otpEmail } from "@/email/otpEmail";

export async function POST(req) {
    try {
        await connectDB();
        const payload = await req.json();

        const validationSchema = zSchema.pick({
            email: true
        })

        const validateData = validationSchema.safeParse(payload);
        if (!validateData) {
            return response(false, 401, 'Invalid or missing field', validateData.error)
        }

        const { email } = validateData.data
        const getUser = await UserModel.findOne({ email });
        if (!getUser) {
            return response(false, 404, 'User not found')
        }

        // reomove old otp

        await OTPModel.deleteMany({ email });
        const newOtp = generateOtp()

        const newOtpData = new OTPModel({
            email,
            otp: newOtp
        })
        await newOtpData.save();

        const otpStatus = await sendMail(email, "Your Login Verifcation Code", otpEmail(newOtp))

        if (!otpStatus) {
            return response(false, 400, 'Failed To send OTP')
        }

        return response(true, 200, "OTP sent successfully")


    } catch (error) {
        console.error('verify-email error:', error) // ← check terminal for the real error
        return errorResponse(error)
    }
}