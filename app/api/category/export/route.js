import { connectDB } from "@/lib/db";
import { errorResponse, response } from "@/lib/helperFunction"
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
        const filter = {
            deletedAt: null
        }

        const getCategory = await CategoryModel.find(filter).sort({ createdAt: -1 }).lean();

        if (!getCategory) {
            return response(false, 400, 'Collection Empty', getCategory)

        }
        return response(true, 200, 'Category Found', getCategory)

    } catch (error) {

        return errorResponse(error)
    }
}