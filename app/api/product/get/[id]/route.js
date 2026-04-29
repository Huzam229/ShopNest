import { connectDB } from "@/lib/db";
import { errorResponse, response } from "@/lib/helperFunction"
import { isValidObjectId } from "mongoose";
import { isAuthenticated } from "@/lib/authentication";
import ProductModel from "@/models/Product.model";
import MediaModel from "@/models/Media.model";

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
        const getProduct = await ProductModel.findOne(filter).populate('media', '_id secure_url').lean();
        if (!getProduct) {
            return response(false, 404, "Product not found")
        }

        return response(true, 200, 'Product Found', getProduct)

    } catch (error) {

        return errorResponse(error)
    }
}