import { connectDB } from "@/lib/db";
import { errorResponse, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { isValidObjectId } from "mongoose";
import { isAuthenticated } from "@/lib/authentication";
import ProductModel from "@/models/Product.model";
import { encode } from "entities";


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
            name: true,
            slug: true,
            category: true,
            mrp: true,
            sellingPrice: true,
            discountPercentage: true,
            description: true,
            media: true
        })
        const validateData = validateSchema.safeParse(payload)
        if (!validateData.success) {
            return response(false, 400, 'Invalid or missing fields.', validateData.error)
        }
        const {
            _id,
            name,
            slug,
            category,
            mrp,
            sellingPrice,
            discountPercentage,
            description,
            media } = validateData.data

        if (!isValidObjectId(_id)) {
            return response(false, 400, 'Invalid object Id.')

        }
        const getProduct = await ProductModel.findOne({ deletedAt: null, _id })
        if (!getProduct) {
            return response(false, 404, 'Media Not Found')
        }
        getProduct.name = name
        getProduct.slug = slug
        getProduct.mrp = mrp
        getProduct.category = category
        getProduct.sellingPrice = sellingPrice
        getProduct.discountPercentage = discountPercentage
        getProduct.description = encode(description)
        getProduct.media = media

        await getProduct.save()
        return response(true, 200, 'Product Updated Successfully')
    } catch (error) {
        return errorResponse(error)
    }
}