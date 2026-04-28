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
import React, { useEffect, useState } from 'react'
import { useForm, useWatch, Controller } from 'react-hook-form'
import slugify from 'slugify'


const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: ADMIN_PRODUCT, label: "Product" },
    { href: '', label: "Add Product" },
]

const AddProduct = () => {
    const [loading, setLoading] = useState(false);
    const [categoryOption, setCategoryOption] = useState([])
    const { data: getCategory } = useFetch(`/api/category?deleteType=SD&size=10000`
    )

    // media modal states

    const [open, setOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState([])

    useEffect(() => {
        if (getCategory && getCategory.success) {
            const data = getCategory.data;
            const option = data.map((item) => ({
                label: item?.name,
                value: item?._id
            }
            ))
            setCategoryOption(option);
        }
    }, [getCategory])

    const formSchema = zSchema.pick({
        name: true,
        slug: true,
        category: true,
        mrp: true,
        sellingPrice: true,
        discountPercentage: true,
        description: true
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            slug: "",
            category: "",
            mrp: "",
            sellingPrice: "",
            discountPercentage: "",
            description: ""
        },
    });

    const nameValue = useWatch({ control: form.control, name: 'name' });

    useEffect(() => {
        form.setValue('slug', nameValue ? slugify(nameValue).toLowerCase() : '')
    }, [nameValue])


    const editor = (event, editor) => {
        const data = editor.getData();
        form.setValue('description', data)
    }

    const handleAddProduct = async (data) => {
        setLoading(true);
        try {
            const res = await fetch("/api/product/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            const result = await res.json();
            if (!result.success) throw new Error(result.message)
            showToast("success", result.message)
            form.reset();
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
                    <h4 className='font-semibold text-xl'>Add Product</h4>
                </CardHeader>
                <CardContent className='pb-5 pt-4'>
                    <form onSubmit={form.handleSubmit(handleAddProduct)}>

                        {/* Row 1 — Name & Slug */}
                        <div className='grid grid-cols-2 gap-4 mb-4'>
                            <div>
                                <label className='mb-1 block'>Name <span className='text-red-500'>*</span></label>
                                <Input
                                    type='text'
                                    className='p-5'
                                    placeholder="Enter product name"
                                    {...form.register("name")}
                                />
                                <p className="text-red-500 text-sm">{errors.name?.message}</p>
                            </div>
                            <div>
                                <label className='mb-1 block'>Slug <span className='text-red-500'>*</span></label>
                                <Input
                                    type='text'
                                    className='p-5'
                                    placeholder="Auto-generated"
                                    {...form.register("slug")}
                                />
                                <p className="text-red-500 text-sm">{errors.slug?.message}</p>
                            </div>
                        </div>

                        {/* Row 2 — MRP, Selling Price, Discount */}
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

                        {/* Row 3 — Category & Description */}
                        <div className='grid grid-cols-2 gap-4 mb-4'>
                            <div>
                                <label className='mb-1 block'>Category <span className='text-red-500'>*</span></label>
                                <Controller
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <Select
                                            options={categoryOption}
                                            selected={field.value}
                                            setSelected={field.onChange}
                                            isMulti={false}
                                        />
                                    )}
                                />
                                <p className="text-red-500 text-sm">{errors.category?.message}</p>
                            </div>
                            <div>
                                <label className='mb-1 block'>Discount % <span className='text-red-500'>*</span></label>
                                <Input
                                    type='number'
                                    className='p-5'
                                    placeholder="Enter discount %"
                                    {...form.register("discountPercentage")}
                                />
                                <p className="text-red-500 text-sm">{errors.discountPercentage?.message}</p>
                            </div>


                        </div>
                        <div className='grid grid-cols-1 mb-4 gap-5'>
                            <div>
                                <label className='mb-1 block'>Product Description <span className='text-red-500'>*</span></label>
                                <Controller
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <Editor
                                            onChange={editor}
                                            initialData={field.value}

                                        />
                                    )}
                                />
                                <p className="text-red-500 text-sm">{errors.description?.message}</p>
                            </div>
                        </div>
                        <div className='md: col-span-2 border-dashed border rounded p-5 text-center'>
                            <MediaModal open={open}
                                setOpen={setOpen}
                                selectedMedia={selectedMedia}
                                setSelectedMedia={setSelectedMedia}
                                isMultiple={true} />
                            <div className='bg-gray-50 dark:bg-card border w-[200px] mx-auto p-5 cursor-pointer' onClick={() => setOpen(true)}>
                                <span className='font-semibold'>Select Media</span>
                            </div>
                        </div>
                        <div className='mt-4 flex items-center justify-center'>
                            <LoadedButton
                                type="submit"
                                text="Add Product"
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

export default AddProduct