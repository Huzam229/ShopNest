import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import Image from 'next/image'
import loading from '@/public/assets/images/loading.svg'
import ModalMediaBlock from './ModalMediaBlock'
import { showToast } from '@/lib/showToast'
import LoadedButton from '../LoadedButton'

const MediaModal = ({ open, setOpen, selectedMedia, setSelectedMedia, isMultiple }) => {

    const [previousSelected, setPreviousSelected] = useState([]);

    const fetchMedia = async (page) => {
        try {
            const res = await fetch(
                `/api/media?page=${page}&limit=18&deleteType=SD`,
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

    const { isPending,
        isError,
        error,
        data,
        isFetching,
        fetchNextPage,
        hasNextPage } = useInfiniteQuery({
            queryKey: ['MediaModal'],
            queryFn: async ({ pageParam }) => {
                return await fetchMedia(pageParam)

            },
            placeholderData: keepPreviousData,
            initialPageParam: 0,
            getNextPageParam: (lastPage, allPages) => {
                const nextPage = allPages.length;
                return lastPage?.hasMore ? nextPage : undefined
            }
        })



    const handleClear = () => {
        setSelectedMedia([])
        setPreviousSelected([])
        showToast('success', 'Media Selection cleared.')
    }

    const handleClose = () => {
        setSelectedMedia(previousSelected)
        setOpen(false)
    }

    const handleSelect = () => {
        if (selectedMedia.length <= 0) {
            return showToast('error', 'Please select a media')
        }
        setPreviousSelected(selectedMedia)
        setOpen(false)
    }
    return (

        <Dialog open={open}
            onOpenChange={() => setOpen(!open)} >
            <DialogContent onInteractOutside={(e) => e.preventDefault()}
                className="sm:max-w-[80%] h-screen p-0 py-10 bg-transparent border-0 shadow-none">
                <DialogDescription className='hidden'>
                </DialogDescription>
                <div className='h-[90vh] bg-white dark:bg-gray-900 p-3 rounded shadow'>
                    <DialogHeader className='h-8 border-b'>
                        <DialogTitle className='text-gray-900 dark:text-white'>
                            Media Selection
                        </DialogTitle>
                    </DialogHeader>
                    <div className='h-[calc(100%-80px)] overflow-auto py-2'>
                        {isPending ?
                            (
                                <div className='size-full flex justify-center items-center'>
                                    <Image src={loading} height={80} width={80} alt='loading' />
                                </div>

                            ) :
                            isError ?
                                (
                                    <div className='size-full flex justify-center items-center'>
                                        <span className='text-red-500'>
                                            {error.message}
                                        </span>
                                    </div>
                                ) :
                                (
                                    <>
                                        <div className='grid lg:grid-cols-6 grid-cols-3 gap-2'>

                                            {
                                                data?.pages?.map((page, index) => (
                                                    <React.Fragment key={index}>
                                                        {
                                                            page?.data?.map((media) => (
                                                                <ModalMediaBlock
                                                                    key={media._id}
                                                                    media={media}
                                                                    selectedMedia={selectedMedia}
                                                                    setSelectedMedia={setSelectedMedia}
                                                                    isMultiple={isMultiple} />
                                                            ))
                                                        }
                                                    </React.Fragment>
                                                ))
                                            }

                                        </div>
                                    </>
                                )}
                    </div>
                    <div className='h-10 pt-3 border-t flex justify-between'>
                        <div>
                            {hasNextPage &&
                                <LoadedButton type='button' loading={isFetching} onClick={() => fetchNextPage()}
                                    className='cursor-pointer mr-2' text="Load More" />
                            }
                            <Button type='button' onClick={handleClear} className='cursor-pointer bg-red-500'>
                                Clear All
                            </Button>
                        </div>
                        <div className='flex gap-5'>
                            <Button type='button' variant='secondary' onClick={handleClose} className='cursor-pointer' >
                                Close
                            </Button>
                            <Button type='button' onClick={handleSelect} className='cursor-pointer'>
                                Select
                            </Button>
                        </div>
                    </div>

                </div>

            </DialogContent>
        </Dialog>
    )
}

export default MediaModal