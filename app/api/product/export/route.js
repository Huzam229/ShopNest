import { connectDB } from "@/lib/db";
import { errorResponse, response } from "@/lib/helperFunction"
import { isAuthenticated } from "@/lib/authentication";
import ProductModel from "@/models/Product.model";


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

        const getProduct = await ProductModel.find(filter).select('-media -description').sort({ createdAt: -1 }).lean();

        if (!getProduct) {
            return response(false, 400, 'Collection Empty', getProduct.error)

        }
        return response(true, 200, 'Product Found', getProduct)

    } catch (error) {

        return errorResponse(error)
    }
}