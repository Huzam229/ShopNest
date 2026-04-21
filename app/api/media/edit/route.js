import { connectDB } from "@/lib/db";
import { errorResponse, isAuthenticated, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import MediaModel from "@/models/Media.model";
import { isValidObjectId } from "mongoose";

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
            title: true,
            alt: true
        })
        const validateData = validateSchema.safeParse(payload)
        if (!validateData.success) {
            return response(false, 400, 'Invalid or empty fields', validateData.error)
        }
        const { _id, alt, title } = validateData.data

        if (!isValidObjectId(_id)) {
            return response(false, 400, 'Invalid object Id.')

        }
        const getMedia = await MediaModel.findById(_id)
        if (!getMedia) {
            return response(false, 404, 'Media Not Found')
        }
        getMedia.alt = alt
        getMedia.title = title
        await getMedia.save()
        return response(true, 200, 'Media Updated Successfully')
    } catch (error) {
        return errorResponse(error)
    }
}