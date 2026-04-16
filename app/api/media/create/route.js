import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import { errorResponse, isAuthenticated, response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";

export async function POST(req) {
    let payload;

    try {
        payload = await req.json();

        const auth = await isAuthenticated("admin");
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized");
        }

        if (!Array.isArray(payload) || payload.length === 0) {
            return response(false, 400, "Invalid payload");
        }

        await connectDB();

        const newMedia = await MediaModel.insertMany(payload);

        return response(true, 200, "Media Uploaded Successfully", newMedia);

    } catch (error) {
        try {
            if (Array.isArray(payload) && payload.length > 0) {
                const publicIds = payload.map(d => d.public_id);

                await cloudinary.api.delete_resources(publicIds, {
                    resource_type: "image",
                });
            }
        } catch (deleteError) {
            console.error("Cloudinary cleanup failed:", deleteError);
        }

        return errorResponse(error);
    }
}