'use client'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import Media from '@/components/Application/Admin/Media'
import UploadMedia from '@/components/Application/Admin/UploadMedia'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { showToast } from '@/lib/showToast'
import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoutes'
import { useInfiniteQuery } from '@tanstack/react-query'
import React, { useState } from 'react'

const breadcrumb = [
    {
        href: ADMIN_DASHBOARD,
        label: 'Home'
    },
    {
        href: '',
        label: 'Media'
    }
]

const MediaPage = () => {
    const [deleteType, setDeleteType] = useState('SD')
    const [selectedMedia, setSelectedMedia] = useState([])
    const fetchMedia = async (page, deleteType) => {
        try {
            const res = await fetch(
                `/api/media?page=${page}&limit=10&deleteType=${deleteType}`,
                {
                    credentials: "include",
                }
            );

            const result = await res.json();

            if (!result.success) {
                throw new Error(result.message);
            }

            return result.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
        queryKey: ['media-data', deleteType],
        queryFn: async ({ pageParam = 0 }) => fetchMedia(pageParam, deleteType), // ✅ FIXED
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => {
            const nextPage = pages.length;
            return lastPage?.hasMore ? nextPage : undefined; // ✅ SAFE
        }
    });

    const handledelete = () => {

    }

    console.log(data)

    return (
        <div>
            <BreadCrumb breadCrumbData={breadcrumb} />
            <Card className="py-0 rounded shadow-sm">
                <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
                    <div className='flex justify-between items-center'>
                        <h4 className='font-semibold test-xl uppercase'>Media</h4>
                        <div className='flex items-center gap-5'>
                            <UploadMedia />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>


                    {status === 'pending'
                        ? <div>Loading...</div>
                        :
                        status === 'error' ?
                            <div className='text-red-500 text-sm'>
                                {error.message}
                            </div>
                            : <div className='grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5'>
                                {
                                    data?.pages?.map((page, index) => (
                                        <React.Fragment key={index}>
                                            {
                                                page?.data?.map((media) => (
                                                    <Media key={media._id}
                                                        media={media}
                                                        handleDelete={handledelete}
                                                        deleteType={deleteType}
                                                        setSelectedMedia={setSelectedMedia}
                                                        selectedMedia={selectedMedia} />
                                                ))
                                            }
                                        </React.Fragment>
                                    ))
                                }
                            </div>
                    }
                </CardContent>
            </Card>

        </div>
    )
}

export default MediaPage