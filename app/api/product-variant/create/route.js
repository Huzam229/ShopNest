import { connectDB } from "@/lib/db";
import { errorResponse, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { isAuthenticated } from "@/lib/authentication";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function POST(req) {

    try {
        const isAuth = await isAuthenticated('admin');
        if (!isAuth.isAuth) {
            return response(false, 403, 'Unauthorized')
        };
        await connectDB();
        const payload = await req.json();

        const validateSchema = zSchema.pick({
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
        const productVariantData = validateData.data;

        const newProductVariant = await ProductVariantModel.create({
            product: productVariantData.product,
            sku: productVariantData.sku,
            color: productVariantData.color,
            size: productVariantData.size,
            mrp: productVariantData.mrp,
            sellingPrice: productVariantData.sellingPrice,
            discountPercentage: productVariantData.discountPercentage,
            media: productVariantData.media
        });

        await newProductVariant.save();
        return response(true, 200, "Product Variant Added Successfully")

    } catch (error) {
        errorResponse(error)
    }
}