import UserModel from "../../../../models/User.model.js";
import { zSchema } from "../../../../lib/zodSchema.js";
import * as jose from 'jose'
import { sendMail } from "../../../../lib/sendMail.js";
import { emailVerificationLink } from "../../../../email/emailVerificationLink.js";
import { connectDB } from "../../../../lib/db.js";
import { errorResponse, response } from "../../../../lib/helperFunction.js";


export async function POST(req) {
    try {
        await connectDB();

        const validationSchema = zSchema.pick({
            name: true,
            email: true,
            password: true
        });

        const payload = await req.json();

        const { name, email, password } = validationSchema.parse(payload);

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return response(false, 400, 'User already exists');
        }

        const newUser = new UserModel({ name, email, password });
        await newUser.save();

        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new jose.SignJWT({ id: newUser._id.toString() }).setIssuedAt()
            .setExpirationTime('1h')
            .setProtectedHeader({ alg: 'HS256' })
            .sign(secretKey);

        await sendMail(
            email,
            "Email Verification Request From ShopNest",
            emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`)
        );

        return response(true, 200, 'User registered successfully, please verify your email address');

    } catch (error) {
        console.log(error);
        return errorResponse(error);
    }
}