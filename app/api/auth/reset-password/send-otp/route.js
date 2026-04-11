import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/db";
import { errorResponse, generateOtp, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";

export async function POST(req) {

    try {

        await connectDB();

        const payload = await req.json();
        const validationSchema = zSchema.pick({
            email: true
        });

        const validatedData = validationSchema.safeParse(payload);
        if (!validatedData) {
            return response(false, 401, "Invalid or missing input field.", validatedData.error)
        }
        const { email } = validatedData.data

        const getUser = await UserModel.findOne({ deletedAt: null, email }).lean();

        if (!getUser) {
            return response(false, 404, "User Not Found",)
        };
        // reomove old otp
        await OTPModel.deleteMany({ email });
        const newOtp = generateOtp()
        const newOtpData = new OTPModel({
            email,
            otp: newOtp
        })
        await newOtpData.save();
        const otpStatus = await sendMail(email, "Your Verifcation Code", otpEmail(newOtp))
        if (!otpStatus) {
            return response(false, 400, 'Failed To send OTP')
        }

        return response(true, 200, "Please verify your account.")

    } catch (error) {

        return errorResponse(error)
    }
}