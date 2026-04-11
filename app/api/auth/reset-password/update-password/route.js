import { connectDB } from "@/lib/db";
import { errorResponse, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";

export async function PUT(req) {

    try {

        await connectDB();
        const payload = await req.json();
        const validationSchema = zSchema.pick({
            email: true,
            password: true
        })
        const validateData = validationSchema.safeParse(payload);
        if (!validateData) {
            return response(false, 401, "Invalid or missing input fields.", validateData.error)
        }
        const { email, password } = validateData.data;

        const getUser = await UserModel.findOne({ deletedAt: null, email }).select('+password')
        if (!getUser) {
            return response(false, 404, "User not found.")
        };

        getUser.password = password

        await getUser.save();

        return response(true, 200, 'Password Changed Successfully.')


    } catch (error) {

        return errorResponse(error)
    }

}