import { connectDB } from "../../../../lib/db";
import { response } from "../../../../lib/helperFunction";
import * as jose from 'jose'
import UserModel from "../../../../models/User.model";

export async function POST(req) {
    try {
        await connectDB();

        let body;
        try {
            body = await req.json();
        } catch {
            return response(false, 400, 'Invalid request body')
        }

        const { token } = body;
        if (!token) {
            return response(false, 400, 'Token Missing.')
        }

        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET)

        let decoded;
        try {
            decoded = await jose.jwtVerify(token, secretKey)
        } catch {
            // Token expired or invalid signature
            return response(false, 401, 'Token is invalid or has expired')
        }

        const userId = decoded.payload.id;
        if (!userId) {
            return response(false, 400, 'Invalid token payload')
        }

        const user = await UserModel.findById(userId)
        if (!user) {
            return response(false, 404, 'User Not Found')
        }

        if (user.isEmailVerified) {
            return response(true, 200, 'Email already verified')
        }

        user.isEmailVerified = true
        await user.save()

        return response(true, 200, 'Email verified successfully')

    } catch (error) {
        console.error('verify-email error:', error) // ← check terminal for the real error
        return response(false, 500, error.message || 'Internal Server Error')
    }
}