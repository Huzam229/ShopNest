import { connectDB } from "@/lib/db";
import { errorResponse, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import ProductVariantModel from "@/models/ProductVariant.model";


export async function PUT(req) {

    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }
        await connectDB()

        const payload = await req.json();
        const ids = payload.ids || [];
        const deleteType = payload.deleteType;

        if (!Array.isArray(ids) || ids.length === 0) {
            return response(false, 400, 'Empty or invalid id list.')
        }

        const productVariant = await ProductVariantModel.find({ _id: { $in: ids } }).lean();
        if (!productVariant.length) {
            return response(false, 400, 'Data not Found')
        }
        if (!['SD', 'RSD'].includes(deleteType)) {
            return response(false, 400, 'Invalid Delete Operation. Delete Type should be SD or RSD for thsi route.')

        }
        if (deleteType === 'SD') {
            await ProductVariantModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: new Date().toISOString() } })
        } else {
            await ProductVariantModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: null } })

        }
        return response(true, 200, deleteType === 'SD' ? 'Data Move into Trash' : 'Data Restore')
    } catch (error) {
        return errorResponse(error)
    }
}

export async function DELETE(req) {

    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized.')
        }
        await connectDB()

        const payload = await req.json();
        const ids = payload.ids || [];
        const deleteType = payload.deleteType;

        if (!Array.isArray(ids) || ids.length === 0) {
            return response(false, 400, 'Empty or invalid id list.')
        }
        const productVariant = await ProductVariantModel.find({ _id: { $in: ids } }).lean();
        if (!productVariant.length) {
            return response(false, 400, 'Data not Found')
        }
        if (deleteType !== 'PD') {
            return response(false, 400, 'Invalid Delete Operation. Delete Type should be PD for this route.')

        }
        await ProductVariantModel.deleteMany({ _id: { $in: ids } })

        return response(true, 200, 'Data deleted Permanently')

    } catch (error) {
        return errorResponse(error)
    }
}