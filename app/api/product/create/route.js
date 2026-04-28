import { connectDB } from "@/lib/db";
import { errorResponse, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import { isAuthenticated } from "@/lib/authentication";
import ProductModel from "@/models/Product.model";

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
        const productData = validateData.data;
        const newProduct = await ProductModel.create({
            name: productData.name,
            slug: productData.slug,
            category: productData.category,
            mrp: productData.mrp,
            sellingPrice: productData.sellingPrice,
            discountPercentage: productData.discountPercentage,
            description: productData.description,
            media: productData.media
        });

        await newProduct.save();
        return response(true, 200, "Product Added Successfully")

    } catch (error) {
        errorResponse(error)
    }
}