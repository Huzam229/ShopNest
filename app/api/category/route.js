import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/db";
import { errorResponse, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";
import { NextResponse } from "next/server";

export async function GET(req) {

    try {

        const isAuth = await isAuthenticated('admin');
        if (!isAuth.isAuth) {
            return response(false, 403, 'Unauthorized')
        }
        await connectDB()
        const searchParams = req.nextUrl.searchParams;
        // extract query parameters

        const start = parseInt(searchParams.get('start') || 0, 10);
        const size = parseInt(searchParams.get('size') || 10, 10);
        const filters = JSON.parse(searchParams.get('filters') || "[]");
        const globalFilter = searchParams.get('globalFilter') || "";
        const sorting = JSON.parse(searchParams.get('sorting') || "[]");
        const deleteType = searchParams.get('deleteType');
        // Build match query

        let matchQuery = {}
        if (deleteType === 'SD') {
            matchQuery = { deletedAt: null }
        } else if (deleteType === 'PD') {
            matchQuery = { deletedAt: { $ne: null } }
        }

        // global search

        if (globalFilter) {
            matchQuery["$or"] = [
                { name: { $regex: globalFilter, $options: 'i' } },
                { slug: { $regex: globalFilter, $options: 'i' } }
            ]
        }

        // Column Filteration

        filters.forEach(filter => {
            matchQuery[filter.id] = { $regex: filter.value, $options: 'i' }
        });

        // sorting
        let sortQuery = {}
        sorting.forEach(sorting => {
            sortQuery[sorting.id] = sorting.desc ? -1 : 1
        });

        // Aggregate pipeLine

        const aggregatePipline = [
            { $match: matchQuery },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
            { $skip: start },
            { $limit: size },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    deletedAT: 1
                }
            }
        ]


        // EXECUTE QUERY

        const getCategory = await CategoryModel.aggregate(aggregatePipline);
        // get Total row count

        const totalRowCount = await CategoryModel.countDocuments(matchQuery);

        return NextResponse.json({
            data: getCategory,
            meta: { totalRowCount },

        })
    } catch (error) {
        errorResponse(error)
        console.error(error); // 👈 VERY IMPORTANT
        return NextResponse.json({ error: error.message }, { status: 500 });

    }

}