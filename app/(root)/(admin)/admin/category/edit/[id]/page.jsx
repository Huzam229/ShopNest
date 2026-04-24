'use client'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import LoadedButton from '@/components/Application/LoadedButton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import { ADMIN_CATEGORY, ADMIN_DASHBOARD } from '@/routes/AdminPanelRoutes'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import slugify from 'slugify'

const breadCrumbData =
    [
        {
            href: ADMIN_DASHBOARD,
            label: "Home"
        },
        {
            href: ADMIN_CATEGORY,
            label: "Category"
        },
        {
            href: '',
            label: "Edit Category"
        },
    ]

const EditCategory = ({ params }) => {
    const { id } = use(params)
    const { data: categoryData } = useFetch(`/api/category/get/${id}`)



    const [loading, setLoading] = useState(false);

    const formSchema = zSchema.pick({
        name: true,
        slug: true
    })
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            slug: ""
        },
    });
    const name = form.watch('name');
    useEffect(() => {
        if (name) {
            form.setValue('slug', slugify(name).toLowerCase())
        } else {
            form.setValue('slug', '')
        }
    }, [name])

    useEffect(() => {
        if (categoryData && categoryData.success) {
            const data = categoryData.data;
            form.reset({
                name: data?.name,
                slug: data?.slug
            })
        }
    }, [categoryData])


    const hanbleAddCategory = async (data) => {
        setLoading(true)
        try {
            const res = await fetch("/api/category/edit", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    _id: id,
                    name: data.name,
                    slug: data.slug
                })
            })
            const result = await res.json();
            if (!result.success) {
                throw new Error(result.message)
            }
            showToast("success", result.message)
            form.reset({
                name: data.name,
                slug: data.slug
            })
        } catch (error) {
            showToast("error", error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <BreadCrumb breadCrumbData={breadCrumbData} />
            <Card className="py-0 rounded shadow-sm">
                <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
                    <h4 className='font-semibold text-xl'>Edit Category</h4>
                </CardHeader>
                <CardContent className='pb-5'>
                    <form onSubmit={form.handleSubmit(hanbleAddCategory)} className="space-y-4">
                        <div className='mb-5'>
                            <label className='mb-1 block'>Name</label>
                            <Input
                                type='text'
                                className='p-5'
                                placeholder="Enter category name"
                                {...form.register("name")}
                            />
                            <p className="text-red-500 text-sm">
                                {form.formState.errors.name?.message}
                            </p>
                        </div>

                        <div className='mb-5'>
                            <label className='mb-1 block'>Slug</label>
                            <Input
                                type='text'
                                className='p-5'
                                placeholder="Enter Slug"
                                {...form.register("slug")}
                            />
                            <p className="text-red-500 text-sm">
                                {form.formState.errors.slug?.message}
                            </p>
                        </div>

                        <div className='items-center justify-center flex'>
                            <LoadedButton
                                type="submit"
                                text="Update Category"
                                className="cursor-pointer p-5 w-50 mt-2 text-[17px] hover:opacity-80 mb-3"
                                loading={loading}
                            />
                        </div>
                    </form>

                </CardContent >
            </Card >
        </div>
    )
}

export default EditCategory