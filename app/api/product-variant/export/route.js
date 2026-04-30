import { connectDB } from "@/lib/db";
import { errorResponse, response } from "@/lib/helperFunction"
import { isAuthenticated } from "@/lib/authentication";
import ProductVariantModel from "@/models/ProductVariant.model";


export async function GET(req) {

    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized")
        }
        await connectDB();
        const filter = {
            deletedAt: null
        }

        const getProductVariant = await ProductVariantModel.find(filter).select('-media').sort({ createdAt: -1 }).lean();

        if (!getProductVariant) {
            return response(false, 400, 'Collection Empty', getProductVariant.error)

        }
        return response(true, 200, 'Product Found', getProductVariant)

    } catch (error) {

        return errorResponse(error)
    }
}