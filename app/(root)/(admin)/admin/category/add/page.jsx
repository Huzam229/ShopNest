'use client'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import LoadedButton from '@/components/Application/LoadedButton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
            label: "Add Category"
        },
    ]

const AddCategory = () => {
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
    useEffect(() => {
        const name = form.watch('name');
        if (name) {
            form.setValue('slug', slugify(name).toLowerCase())
        } else {
            form.setValue('slug', '')
        }
    }, [form.watch('name')])

    const hanbleAddCategory = async (data) => {
        setLoading(true)
        try {
            const res = await fetch("/api/category/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.name,
                    slug: data.slug
                })
            })
            const result = await res.json();
            if (!result.success) {
                throw new Error(result.message)
            }
            showToast("success", result.message)
            form.reset();
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
                    <h4 className='font-semibold text-xl'>Add Category</h4>
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
                                {form.formState.errors.alt?.message}
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
                                {form.formState.errors.title?.message}
                            </p>
                        </div>

                        <div className='items-center justify-center flex'>
                            <LoadedButton
                                type="submit"
                                text="Add Category"
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

export default AddCategory