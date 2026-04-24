import { connectDB } from "@/lib/db";
import { errorResponse, response } from "@/lib/helperFunction"
import { isValidObjectId } from "mongoose";
import { isAuthenticated } from "@/lib/authentication";
import CategoryModel from "@/models/Category.model";


export async function GET(req, { params }) {

    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized")
        }
        await connectDB();
        const getParams = await params;
        const id = getParams.id;
        const filter = {
            deletedAt: null
        }

        if (!isValidObjectId(id)) {
            return response(false, 404, "Invalid Object Id.")

        }

        filter._id = id
        const getCategory = await CategoryModel.findOne(filter).lean();
        if (!getCategory) {
            return response(false, 404, "Category not found")
        }

        return response(true, 200, 'Category Found', getCategory)

    } catch (error) {

        return errorResponse(error)
    }
}