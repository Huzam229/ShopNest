import { connectDB } from "@/lib/db";
import { errorResponse, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/Category.model";
import { isAuthenticated } from "@/lib/authentication";

export async function POST(req) {

    try {
        const isAuth = await isAuthenticated('admin');
        if (!isAuth.isAuth) {
            return response(false, 403, 'Unauthorized')
        };
        await connectDB();
        const payload = await req.json();

        const validateSchema = zSchema.pick({
            name: true,
            slug: true
        })
        const validateData = validateSchema.safeParse(payload)
        if (!validateData.success) {
            return response(false, 400, 'Invalid or missing fields.', validateData.error)
        }
        const { name, slug } = validateData.data
        const newCategory = await CategoryModel.create({
            name, slug
        });

        await newCategory.save();

        return response(true, 200, "Category Added Successfully")

    } catch (error) {
        errorResponse(error)
    }
}