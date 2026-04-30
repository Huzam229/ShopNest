'use client'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import Editor from '@/components/Application/Admin/Editor'
import MediaModal from '@/components/Application/Admin/MediaModal'
import Select from '@/components/Application/Admin/Select'
import LoadedButton from '@/components/Application/LoadedButton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import { ADMIN_DASHBOARD, ADMIN_PRODUCT } from '@/routes/AdminPanelRoutes'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import React, { use, useEffect, useState } from 'react'
import { useForm, useWatch, Controller } from 'react-hook-form'
import slugify from 'slugify'
import { useRef } from 'react';
import { sizeData } from '@/lib/utils'


const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: ADMIN_PRODUCT, label: "Product Variant" },
    { href: '', label: "Edit Product Variant" },
]

const EditProductVariant = ({ params }) => {
    const { id } = use(params)
    const [loading, setLoading] = useState(false);
    const [productOption, setProductOption] = useState([])
    const { data: getProduct } = useFetch(`/api/product?deleteType=SD&size=10000`
    )
    const { data: productVaraintData } = useFetch(`/api/product-variant/get/${id}`)
    const [discountPrice, setDiscountPrice] = useState(null)

    // media modal states

    const [open, setOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState([])

    useEffect(() => {
        if (getProduct && getProduct.success) {
            const data = getProduct.data;
            const option = data.map((item) => ({
                label: item?.name,
                value: item?._id
            }
            ))
            setProductOption(option);
        }
    }, [getProduct])

    const formSchema = zSchema.pick({
        product: true,
        sku: true,
        color: true,
        size: true,
        mrp: true,
        sellingPrice: true,
        discountPercentage: true,
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            product: "",
            sku: "",
            color: "",
            size: "",
            mrp: 0,
            sellingPrice: 0,
            discountPercentage: 0,
        },
    });


    useEffect(() => {
        if (productVaraintData && productVaraintData.success) {
            const product = productVaraintData?.data
            form.reset({
                product: product?.product || "",
                color: product?.color || "",
                size: product?.size || "",
                sku: product?.sku || "",
                mrp: product?.mrp || 0,
                sellingPrice: product?.sellingPrice || 0,
                discountPercentage: product?.discountPercentage || 0,
                description: product?.description || ""
            });

            if (product?.media) {
                const media = product.media.map((media => ({
                    _id: media._id,
                    secure_url: media.secure_url
                })))
                setSelectedMedia(media)
            }

        }

    }, [productVaraintData])

    // discount percentage calculation

    const mrp = form.watch('mrp')
    const sellingPrice = form.watch('sellingPrice')

    useEffect(() => {
        if (!mrp || mrp === 0) {
            form.setValue('discountPercentage', 0)
            return
        }

        const discountPercentage = ((mrp - sellingPrice) / mrp) * 100
        setDiscountPrice(discountPercentage)
        form.setValue('discountPercentage', Math.round(discountPercentage))
    }, [mrp, sellingPrice])


    const handleEditProductVariant = async (data) => {
        setLoading(true);
        if (selectedMedia.length <= 0)
            return showToast('error', 'Please Select Media')
        const mediaIds = selectedMedia.map(m => m._id)
        try {
            const res = await fetch("/api/product-variant/edit", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    _id: id,
                    product: data.product,
                    sku: data.sku,
                    color: data.color,
                    size: data.size,
                    mrp: data.mrp,
                    sellingPrice: data.sellingPrice,
                    discountPercentage: data.discountPercentage,
                    media: mediaIds
                })
            })
            const result = await res.json();
            if (!result.success) throw new Error(result.message)
            showToast("success", result.message)
        } catch (error) {
            showToast("error", error.message)
        } finally {
            setLoading(false);
        }
    }
    const { errors } = form.formState;

    return (
        <div>
            <BreadCrumb breadCrumbData={breadCrumbData} />
            <Card className="py-0 rounded shadow-sm">
                <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
                    <h4 className='font-semibold text-xl'>Edit Product Variant</h4>
                </CardHeader>
                <CardContent className='pb-5 pt-4'>
                    <form onSubmit={form.handleSubmit(handleEditProductVariant)}>

                        {/* Row 1 — Name & Slug */}
                        <div className='grid grid-cols-2 gap-4 mb-4'>
                            <div>
                                <label className='mb-1 block'>Product <span className='text-red-500'>*</span></label>
                                <Controller
                                    control={form.control}
                                    name="product"
                                    render={({ field }) => (
                                        <Select
                                            options={productOption}
                                            selected={field.value}
                                            setSelected={field.onChange}
                                            isMulti={false}
                                        />
                                    )}
                                />
                                <p className="text-red-500 text-sm">{errors.product?.message}</p>
                            </div>
                            <div>
                                <label className='mb-1 block'>SKU <span className='text-red-500'>*</span></label>
                                <Input
                                    type='text'
                                    className='p-5'
                                    placeholder="Enter sku"
                                    {...form.register("sku")}
                                />
                                <p className="text-red-500 text-sm">{errors.sku?.message}</p>
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4 mb-4'>
                            <div>
                                <label className='mb-1 block'>Color <span className='text-red-500'>*</span></label>
                                <Input
                                    type='text'
                                    className='p-5'
                                    placeholder="Enter Color"
                                    {...form.register("color")}
                                />
                                <p className="text-red-500 text-sm">{errors.color?.message}</p>
                            </div>
                            <div>
                                <label className='mb-1 block'>Size <span className='text-red-500'>*</span></label>
                                <Controller
                                    control={form.control}
                                    name="size"
                                    render={({ field }) => (
                                        <Select
                                            options={sizeData}
                                            selected={field.value}
                                            setSelected={field.onChange}
                                            isMulti={false}
                                        />
                                    )}
                                />
                                <p className="text-red-500 text-sm">{errors.size?.message}</p>
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4 mb-4'>
                            <div>
                                <label className='mb-1 block'>MRP <span className='text-red-500'>*</span></label>
                                <Input
                                    type='number'
                                    className='p-5'
                                    placeholder="Enter MRP"
                                    {...form.register("mrp")}
                                />
                                <p className="text-red-500 text-sm">{errors.mrp?.message}</p>
                            </div>
                            <div>
                                <label className='mb-1 block'>Selling Price <span className='text-red-500'>*</span></label>
                                <Input
                                    type='number'
                                    className='p-5'
                                    placeholder="Enter selling price"
                                    {...form.register("sellingPrice")}
                                />
                                <p className="text-red-500 text-sm">{errors.sellingPrice?.message}</p>
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4 mb-4'>
                            <div className='relative'>
                                <label className='mb-1 block'>Discount % <span className='text-red-500'>*</span></label>
                                <Input
                                    type='number'
                                    className='p-5 pr-10'
                                    placeholder="Auto-generated"
                                    {...form.register("discountPercentage")}
                                    readOnly
                                />
                                <span className={`absolute left-10 top-9 text-gray-800 dark:text-white ${discountPrice >= 100 ? 'left-12' : ''}`}>
                                    %
                                </span>
                                <p className="text-red-500 text-sm">{errors.discountPercentage?.message}</p>
                            </div>


                        </div>
                        <div className='md: col-span-2 border-dashed border rounded p-5 text-center'>
                            <MediaModal open={open}
                                setOpen={setOpen}
                                selectedMedia={selectedMedia}
                                setSelectedMedia={setSelectedMedia}
                                isMultiple={true} />

                            {selectedMedia.length > 0 &&
                                <div className='flex justify-center items-center flex-wrap mb-3 gap-2'>
                                    {selectedMedia.map((media) => (
                                        <div key={media._id} className='h-24 w-24 border'>
                                            <Image src={media.secure_url} height={100} width={100} alt={media?.alt || ''}
                                                className='size-full object-cover' />
                                        </div>
                                    ))}
                                </div>
                            }

                            <div className='bg-gray-50 dark:bg-card border w-[200px] mx-auto p-5 cursor-pointer' onClick={() => setOpen(true)}>
                                <span className='font-semibold'>Select Product Media</span>
                            </div>

                        </div>
                        <div className='mt-4 flex items-center justify-center'>
                            <LoadedButton
                                type="submit"
                                text="Update Product Variant"
                                className="cursor-pointer p-5 w-50 mt-2 text-[17px] hover:opacity-80 mb-3"
                                loading={loading}
                            />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default EditProductVariant