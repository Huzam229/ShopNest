import connectDB from "@/lib/db";
import UserModel from "@/models/user.model";
import { z } from 'zod';
import response from "@/lib/helperFunction";
import * as jose from 'jose'


export async function POST(req) {
    try {
        await connectDB();
        // validate using zod
        const validationSchema = z.Schema.pick({
            name: true,
            email: true,
            password: true
        })
        const payload = await req.json();
        const validateData = validationSchema.parse(payload);
        if (!validateData) {
            return response(false, 400, 'All fields are required', validateData.error);
        }
        const { name, email, password } = validateData.data;
        const user = await UserModel.findOne({ email });
        if (user) {
            return response(false, 400, 'User already exists');
        }
        const newUser = UserModel({
            name, email, password
        })
        await newUser.save();

        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new jose.SignJWT({ id: newUser._id }).setIssuedAt()
            .setExpirationTime('1h')
            .setProtectedHeader({ alg: 'HS256' })
            .sign(secretKey);

        return response(true, 200, 'User registered successfully', { token });

    } catch (error) {
        console.log(error);
        return response(false, 500, 'Internal server error');
    }
}