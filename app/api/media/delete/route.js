import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import { errorResponse, isAuthenticated, response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";
import mongoose from "mongoose";

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

        const media = await MediaModel.find({ _id: { $in: ids } }).lean();
        if (!media.length) {
            return response(false, 400, 'Data not Found')
        }
        if (!['SD', 'RSD'].includes(deleteType)) {
            return response(false, 400, 'Invalid Delete Operation. Delete Type should be SD or RSD for thsi route.')

        }
        if (deleteType === 'SD') {
            await MediaModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: new Date().toISOString() } })
        } else {
            await MediaModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: null } })

        }
        return response(true, 200, deleteType === 'SD' ? 'Data Move into Trash' : 'Data Restore')
    } catch (error) {
        errorResponse(error)
    }
}

export async function DELETE(req) {

    const session = await mongoose.startSession();
    session.startTransaction();
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

        const media = await MediaModel.find({ _id: { $in: ids } }).session(session).lean();
        if (!media.length) {
            return response(false, 400, 'Data not Found')
        }
        if (deleteType !== 'PD') {
            return response(false, 400, 'Invalid Delete Operation. Delete Type should be PD for this route.')

        }
        await MediaModel.deleteMany({ _id: { $in: ids } }).session(session);

        // delete all media from cloudinary
        const public_id = media.map(m => m.public_id);

        try {
            await cloudinary.api.delete_resources(public_id)
        } catch (error) {
            await session.abortTransaction()
            session.endSession();
        }
        await session.commitTransaction();
        session.endSession();
        return response(true, 200, 'Data deleted Permanently')
    } catch (error) {
        await session.commitTransaction();
        session.endSession();
        errorResponse(error)
    }
}