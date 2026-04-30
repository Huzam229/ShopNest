import { connectDB } from "@/lib/db";
import { errorResponse, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { isValidObjectId } from "mongoose";
import { isAuthenticated } from "@/lib/authentication";
import ProductVariantModel from "@/models/ProductVariant.model";


export async function PUT(req) {
    try {

        const isAuth = await isAuthenticated('admin');
        if (!isAuth.isAuth) {
            return response(false, 403, 'Unauthorized')
        };
        await connectDB();
        const payload = await req.json();
        const validateSchema = zSchema.pick({
            _id: true,
            product: true,
            sku: true,
            color: true,
            size: true,
            mrp: true,
            sellingPrice: true,
            discountPercentage: true,
            media: true
        })
        const validateData = validateSchema.safeParse(payload)
        if (!validateData.success) {
            return response(false, 400, 'Invalid or missing fields.', validateData.error)
        }
        const {
            _id,
            product,
            sku,
            color,
            size,
            mrp,
            sellingPrice,
            discountPercentage,
            media } = validateData.data

        if (!isValidObjectId(_id)) {
            return response(false, 400, 'Invalid object Id.')

        }
        const getProductVariant = await ProductVariantModel.findOne({ deletedAt: null, _id })
        if (!getProductVariant) {
            return response(false, 404, 'Product Variant Not Found')
        }
        getProductVariant.product = product
        getProductVariant.color = color
        getProductVariant.sku = sku
        getProductVariant.size = size
        getProductVariant.mrp = mrp
        getProductVariant.sellingPrice = sellingPrice
        getProductVariant.discountPercentage = discountPercentage
        getProductVariant.media = media

        await getProductVariant.save()
        return response(true, 200, 'Product Variant Updated Successfully')
    } catch (error) {
        return errorResponse(error)
    }
}