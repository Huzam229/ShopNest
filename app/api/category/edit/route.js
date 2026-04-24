import { connectDB } from "@/lib/db";
import { errorResponse, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { isValidObjectId } from "mongoose";
import { isAuthenticated } from "@/lib/authentication";
import CategoryModel from "@/models/Category.model";


export async function PUT(req) {
    try {

        const isAuth = await isAuthenticated('admin');
        if (!isAuth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }
        await connectDB();
        const payload = await req.json();
        const validateSchema = zSchema.pick({
            _id: true,
            name: true,
            slug: true
        })
        const validateData = validateSchema.safeParse(payload)
        if (!validateData.success) {
            return response(false, 400, 'Invalid or empty fields', validateData.error)
        }
        const { _id, name, slug } = validateData.data
        console.log(payload)

        if (!isValidObjectId(_id)) {
            return response(false, 400, 'Invalid object Id.')

        }
        const getCategory = await CategoryModel.findById(_id)
        if (!getCategory) {
            return response(false, 404, 'Media Not Found')
        }
        getCategory.name = name
        getCategory.slug = slug
        await getCategory.save()
        return response(true, 200, 'Category Updated Successfully')
    } catch (error) {
        return errorResponse(error)
    }
}