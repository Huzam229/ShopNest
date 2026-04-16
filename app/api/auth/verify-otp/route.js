import { zSchema } from "@/lib/zodSchema";
import { connectDB } from "../../../../lib/db";
import { errorResponse, response } from "../../../../lib/helperFunction";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import * as jose from 'jose'
import { cookies } from "next/headers";


export async function POST(req) {
    try {
        await connectDB();
        const payload = await req.json();
        const validationSchema = zSchema.pick({
            email: true,
            otp: true
        })

        const validateData = validationSchema.safeParse(payload);

        if (!validateData.success) {
            return response(false, 401, "Invalid or missing input field.", validateData.error)
        }

        const { email, otp } = validateData.data;
        const getOtpData = await OTPModel.findOne({ email, otp })
        if (!getOtpData) {
            return response(false, 404, "Invalid or expire otp.")
        }
        const getUser = await UserModel.findOne({ deletedAt: null, email }).lean();

        if (!getUser) {
            return response(false, 404, "User Not Found")
        }
        const loginUserdata = {
            id: getUser._id,
            role: getUser.role,
            name: getUser.name,
            avatar: getUser.avatar
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const token = await new jose.SignJWT(loginUserdata)
            .setIssuedAt()
            .setExpirationTime('24h')
            .setProtectedHeader({ alg: 'HS256' })
            .sign(secret)

        const cookieStore = await cookies()
        cookieStore.set({
            name: 'access-token',
            value: token,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        })
        // remove otp after validation
        await getOtpData.deleteOne()

        return response(true, 200, "Login Successfull.", loginUserdata)


    } catch (error) {
        console.error('verify-email error:', error) // ← check terminal for the real error
        return errorResponse(error)
    }
}