
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


export const columnConfig = (column, isCreatedAt = false, isUpdatedAt = false, isDeletedAt = false) => {

    const newColumn = [...column];

    if (isCreatedAt) {
        newColumn.push(
            {
                accessorKey: 'createdAt',
                header: 'Created At',
                Cell: ({ renderedCellValue }) => (new Date(renderedCellValue).toLocaleString())
            },
        );
    }

    if (isUpdatedAt) {
        newColumn.push(
            {
                accessorKey: 'updatedAt',
                header: 'Updated At',
                Cell: ({ renderedCellValue }) => (new Date(renderedCellValue).toLocaleString())
            },
        );
    }

    if (isDeletedAt) {
        newColumn.push(
            {
                accessorKey: 'deletedAt',
                header: 'Deleted At',
                Cell: ({ renderedCellValue }) => (new Date(renderedCellValue).toLocaleString())
            },
        );
    }

    return newColumn;
};


