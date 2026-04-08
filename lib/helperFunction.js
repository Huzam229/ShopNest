import { NextResponse } from "next/server";

export const response = (success, statusCode, messaga, data = {}) => {
    return NextResponse.json({
        success,
        statusCode,
        messaga,
        data
    }, { status: statusCode })
}


export const errorResponse = (error, customMessage) => {
    // handle duplicate key
    if (error.code === 11000) {
        const keys = Object.keys(error.keyPattern).join(',');
        error.message = `Duplicate filed: ${keys}. These Field value must be unique.`
    }
    let errObj = {}
    if (process.env.NODE_ENV === 'development') {
        errObj = {
            message: error.message,
            error
        }
    } else {
        errObj = {
            message: error.customMessage || "Interanl Server Error",
            error
        }
    }
    return response(false, error.code, ...errObj)
}