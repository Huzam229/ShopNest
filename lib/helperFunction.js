import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export const response = (success, statusCode, message, data = {}) => {
    return NextResponse.json({
        success,
        statusCode,
        message,
        data
    }, { status: statusCode })
}
export const errorResponse = (error, customMessage) => {
    if (error.code === 11000) {
        const keys = Object.keys(error.keyPattern || {}).join(',');
        error.message = `Duplicate field: ${keys}. These field values must be unique.`;
    }

    let errObj = {};

    if (process.env.NODE_ENV === "development") {
        errObj = {
            message: error.message,
            error,
        };
    } else {
        errObj = {
            message: customMessage || error.message || "Internal Server Error",
        };
    }

    return NextResponse.json(
        {
            success: false,
            statusCode: error.code || 500,
            ...errObj,
        },
        { status: error.code || 500 }
    );
};

export const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp
}

export const isAuthenticated = async (role) => {
    try {
        const cookieStore = await cookies();

        if (!cookieStore.has("access-token")) {
            return { isAuth: false };
        }

        const access_token = cookieStore.get("access-token");

        const { payload } = await jwtVerify(
            access_token.value,
            new TextEncoder().encode(process.env.JWT_SECRET)
        );

        if (payload.role !== role) {
            return { isAuth: false };
        }

        return {
            isAuth: true,
            userId: payload._id,
        };

    } catch (error) {
        return { isAuth: false };
    }
};