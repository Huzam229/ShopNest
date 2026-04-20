'use client'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import Media from '@/components/Application/Admin/Media'
import UploadMedia from '@/components/Application/Admin/UploadMedia'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import useDeleteMutation from '@/hooks/useDeleteMutation'
import { ADMIN_DASHBOARD, ADMIN_MEDIA } from '@/routes/AdminPanelRoutes'
import { useInfiniteQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { LuTrash } from 'react-icons/lu';
import { MdOutlinePermMedia } from "react-icons/md";




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
    const searchParams = useSearchParams();
    const [selectAll, setSelectAll] = useState(false)

    useEffect(() => {
        if (searchParams) {
            const trashOf = searchParams.get('trashof')
            setSelectedMedia([])
            if (trashOf) {
                setDeleteType('PD')
            } else {
                setDeleteType('SD')
            }
        }
    }, [searchParams])

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
            return lastPage?.hasMore ? nextPage : undefined;
        }
    });

    console.log(data)

    const deleteMutation = useDeleteMutation('media-data', '/api/media/delete')

    const handledelete = (selectedMedia, deleteType) => {
        let c = true;
        if (deleteType === 'PD') {
            c = confirm("Are You Sure you want to delete the data permanently?")
        }
        if (c) {
            deleteMutation.mutate({ ids: selectedMedia, deleteType }) // ✅ single object
        }
        setSelectAll(false);
        setSelectedMedia([])
    }


    const hanldeSelectAll = () => {
        setSelectAll(!selectAll)

    }
    useEffect(() => {
        if (selectAll) {
            const ids = data?.pages?.flatMap(page => page.data?.map(m => m._id))
            setSelectedMedia(ids)
        } else {
            setSelectedMedia([])
        }
    }, [selectAll])

    return (
        <div>
            <BreadCrumb breadCrumbData={breadcrumb} />
            <Card className="py-0 rounded shadow-sm">
                <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
                    <div className='flex justify-between items-center'>
                        <h4 className='font-semibold test-xl uppercase'>
                            {deleteType === 'SD' ? 'Media' : 'Trash'}
                        </h4>
                        <div className='flex items-center gap-5'>
                            {
                                deleteType === 'SD' && <UploadMedia />
                            }
                            <div className='flex gap-3'>
                                {deleteType === 'SD' ?
                                    <Button type='button' className='bg-red-500' >
                                        <Link href={`${ADMIN_MEDIA}?trashof=media`} className='flex items-center justify-center gap-1' >
                                            <LuTrash className='text-white' />
                                            Trash
                                        </Link>
                                    </Button>
                                    : <Button type='button'>
                                        <Link href={`${ADMIN_MEDIA}`} className='flex items-center justify-center gap-1'  >
                                            <MdOutlinePermMedia />
                                            Back To Media
                                        </Link>
                                    </Button>
                                }

                            </div>
                        </div>

                    </div>
                </CardHeader>
                <CardContent>

                    {
                        selectedMedia.length > 0 && <div className='py-2 px-3 mb-2 
                        cursor-pointer rounded flex justify-between items-center'
                        >
                            <label className='flex items-center justify-center gap-2'>
                                <Checkbox checked={selectAll} className='border border-primary' onCheckedChange={hanldeSelectAll} />
                                Select All</label>
                            <div className='flex gap-2'>
                                {
                                    deleteType === 'SD' ? <Button
                                        onClick={() => handledelete(selectedMedia, deleteType)}
                                        className='bg-red-500 cursor-pointer hover:opacity-70'>Move To Trash
                                    </Button> :
                                        <>
                                            <Button className="bg-green-500 cursor-pointer hover:opacity-70 "
                                                onClick={() => handledelete(selectedMedia, 'RSD')}
                                            >Restore
                                            </Button>
                                            <Button className='bg-red-500 cursor-pointer hover:opacity-70'
                                                onClick={() => handledelete(selectedMedia, deleteType)}
                                            >Delete Permanently
                                            </Button>
                                        </>
                                }
                            </div>
                        </div>
                    }


                    {status === 'pending'
                        ? <div className='mb-2'>Loading...</div>
                        :
                        status === 'error' ?
                            <div className='text-red-500 text-sm'>
                                {error.message}
                            </div>
                            :
                            <>
                                {data?.pages?.flatMap(page => page.data)?.length === 0 && (
                                    <div className='text-center text-red-500'>Nothing in Trash</div>
                                )}                                <div className='grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5'>
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
                                                            selectedMedia={selectedMedia}
                                                        />
                                                    ))
                                                }
                                            </React.Fragment>
                                        ))
                                    }
                                </div>
                            </>

                    }
                </CardContent>
            </Card>

        </div>
    )
}

export default MediaPage