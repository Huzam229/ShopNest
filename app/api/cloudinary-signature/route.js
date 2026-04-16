import cloudinary from "@/lib/cloudinary";
import { errorResponse } from "@/lib/helperFunction";
import { NextResponse } from "next/server";

export async function POST(req) {

    try {
        const payload = await req.json()
        const { paramsToSign } = payload
        const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_SECRET_KEY);
        return NextResponse.json({ signature })

    } catch (error) {
        errorResponse(error)
    }
}