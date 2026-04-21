'use client'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb';
import LoadedButton from '@/components/Application/LoadedButton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import useFetch from '@/hooks/useFetch';
import { zSchema } from '@/lib/zodSchema';
import { ADMIN_DASHBOARD, ADMIN_MEDIA, ADMIN_MEDIA_EDIT } from '@/routes/AdminPanelRoutes';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import imgPlaceHolder from '@/public/assets/images/img-placeholder.webp'
import { showToast } from '@/lib/showToast';


const breadCrumbData =
    [
        {
            href: ADMIN_DASHBOARD,
            label: "Home"
        },
        {
            href: ADMIN_MEDIA,
            label: "Media"
        },
        {
            href: '',
            label: "Edit Media"
        },
    ]

const EditPage = ({ params }) => {
    const { id } = use(params);
    const { data: mediaData, refetch } = useFetch(`/api/media/get/${id}`)
    const [loading, setLoading] = useState(false)

    const formSchema = zSchema.pick({
        _id: true,
        alt: true,
        title: true
    })
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            _id: "",
            alt: "",
            title: ""
        },
    });

    useEffect(() => {

        if (mediaData && mediaData.success) {
            const data = mediaData.data
            form.reset({
                _id: mediaData?.data?._id,
                alt: mediaData?.data?.alt || '',
                title: mediaData?.data?.title || ''
            })
        }
    }, [mediaData])

    const hanbleMediaEdit = async (data) => {
        setLoading(true)
        try {
            const res = await fetch("/api/media/edit", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    _id: id,
                    alt: data.alt,
                    title: data.title
                })
            })
            const result = await res.json();
            if (!result.success) {
                throw new Error(result.message)
            }
            showToast("success", result.message)
            refetch()
            form.reset();
        } catch (error) {
            showToast("error", error.message)
        } finally {
            setLoading(false)
        }
    }

    console.log(mediaData)

    return (
        <div>
            <BreadCrumb breadCrumbData={breadCrumbData} />
            <Card className="py-0 rounded shadow-sm">
                <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
                    <h4 className='font-semibold text-xl'>Edit Media</h4>
                </CardHeader>
                <CardContent className='pb-5'>
                    <form onSubmit={form.handleSubmit(hanbleMediaEdit)} className="space-y-4">
                        <div className='mb-5'>
                            <Image
                                src={mediaData?.data?.secure_url || imgPlaceHolder}
                                width={200}
                                height={200}
                                alt={mediaData?.data?.alt || 'Image'}
                            />
                        </div>

                        <div className='mb-5'>
                            <label className='mb-1 block'>Alt</label>
                            <Input
                                type='text'
                                className='p-5'
                                placeholder="Enter alt"
                                {...form.register("alt")}
                            />
                            <p className="text-red-500 text-sm">
                                {form.formState.errors.alt?.message}
                            </p>
                        </div>

                        <div className='mb-5'>
                            <label className='mb-1 block'>Title</label>
                            <Input
                                type='text'
                                className='p-5'
                                placeholder="Enter title"
                                {...form.register("title")}
                            />
                            <p className="text-red-500 text-sm">
                                {form.formState.errors.title?.message}
                            </p>
                        </div>

                        <div className='items-center justify-center flex'>
                            <LoadedButton
                                type="submit"
                                text="Update Media"
                                className="cursor-pointer p-5 w-50 mt-2 text-[17px] hover:opacity-80 mb-3"
                                loading={loading}
                            />
                        </div>
                    </form>

                </CardContent >
            </Card >
        </div >
    )
}

export default EditPage