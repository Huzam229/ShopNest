import { NextResponse } from "next/server";
export const response = (success, statusCode, messaga, data = {}) => {
    return NextResponse.json({
        success,
        statusCode,
        messaga,
        data
    }, { status: statusCode })
}