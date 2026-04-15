import { connectDB } from "@/lib/db";
import { errorResponse, response } from "@/lib/helperFunction";
import { cookies } from "next/headers";

export async function POST(req) {

    try {

        await connectDB();
        const cookieStore = await cookies();
        cookieStore.delete('access-token');

        return response(true, 200, 'Logout Successfully')

    } catch (error) {

        errorResponse(error)
    }
}