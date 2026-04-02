import connectDB from "@/lib/db";
import UserModel from "@/models/user.model";
import { z } from 'zod';
import response from "@/lib/helperFunction";

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

    } catch (error) {
        console.log(error);
        return response(false, 500, 'Internal server error');
    }
}