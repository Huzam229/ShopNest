import { connectDB } from "@/lib/db"
import { errorResponse, generateOtp, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";
import { z } from 'zod'
import * as jose from 'jose'
import { emailVerificationLink } from "@/email/emailVerificationLink";
import { sendMail } from "@/lib/sendMail";
import OTPModel from "@/models/Otp.model";
import { otpEmail } from "@/email/otpEmail";

export async function POST(req) {

    try {
        await connectDB();
        const payload = await req.json();
        const validationSchema = zSchema.pick({
            email: true,
        }).extend({
            password: z.string()
        })

        const validatedData = validationSchema.safeParse(payload)
        if (!validatedData.success) {
            return response(false, 400, 'Invalid or missing input field.')
        }

        const { email, password } = validatedData.data
        // get user data

        const getUser = await UserModel.findOne({ deletedAt: null, email }).select("+password")
        if (!getUser) {
            return response(false, 404, 'Invalid login credientials')
        }
        // if email is not verified resend email verification 
        const isEmailVerified = getUser.isEmailVerified
        if (!isEmailVerified) {
            const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
            const token = await new jose.SignJWT({ id: getUser._id.toString() }).setIssuedAt()
                .setExpirationTime('1h')
                .setProtectedHeader({ alg: 'HS256' })
                .sign(secretKey);
            await sendMail(
                email,
                "Email Verification Request From ShopNest",
                emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`)
            );

            return response(false, 401,
                'Your email is not verified.We have send verification link to your registered email address.')
        }

        // password verification

        const isPasswordVerified = await getUser.comparePassword(password);
        if (!isPasswordVerified) {
            return response(false, 400, 'Invalid login credientials')
        }

        // otp_generation
        await OTPModel.deleteMany({ email });  // deleting old otps
        const otp = generateOtp();

        // storing otp in db
        const newOtpData = new OTPModel({
            email: email,
            otp: otp
        })
        await newOtpData.save();
        const otpEmailStatus = await sendMail(email, "Your login verification code", otpEmail(otp))

        if (!otpEmailStatus.success) {
            return response(false, 400, 'Failed to send OTP')
        }

        return response(true, 200, `OTP send to ${email}`)


    } catch (error) {
        return errorResponse(error)
    }
}