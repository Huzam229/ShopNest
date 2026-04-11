import { zSchema } from "@/lib/zodSchema";
import { connectDB } from "@/lib/db";
import { errorResponse, response } from "@/lib/helperFunction";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";


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
        // remove otp after validation
        await getOtpData.deleteOne()

        return response(true, 200, "OTP verified Successfull.")

    } catch (error) {
        console.error('verify-email error:', error) // ← check terminal for the real error
        return errorResponse(error)
    }
}