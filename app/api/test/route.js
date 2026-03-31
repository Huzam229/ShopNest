import { connectDB } from "@/lib/db.js";
import { NextResponse } from "next/server";

export async  function GET(){
    await connectDB();
    return NextResponse.json({
        success: true,
        message: "Connection Established"
    })
}
    