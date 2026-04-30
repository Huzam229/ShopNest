'use client'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import DataTableWrapper from '@/components/Application/Admin/DataTableWrapper'
import DeleteAction from '@/components/Application/Admin/DeleteAction'
import EditAction from '@/components/Application/Admin/EditAction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DT_PRODUCT_VARIANT_COLUMN } from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import { ADMIN_DASHBOARD, ADMIN_PRODUCT, ADMIN_TRASH, ADMIN_PRODUCT_VARIANT_ADD, ADMIN_PRODUCT_VARIANT_EDIT } from '@/routes/AdminPanelRoutes'
import Link from 'next/link'
import React, { useCallback, useMemo } from 'react'
import { FiPlus } from 'react-icons/fi';


const breadCrumbData =
    [
        {
            href: ADMIN_DASHBOARD,
            label: "Home"
        },
        {
            href: ADMIN_PRODUCT,
            label: "Product Variant"
        },
    ]

const AllProductVariant = () => {

    const columns = useMemo(() => {
        return columnConfig(DT_PRODUCT_VARIANT_COLUMN)
    }, [])

    const action = useCallback((row, deleteType, handleDelete) => {
        let actionMenu = []
        actionMenu.push(<EditAction href={ADMIN_PRODUCT_VARIANT_EDIT(row.original._id)} key="edit" />)
        actionMenu.push(<DeleteAction handleDelete={handleDelete} row={row} deleteType={deleteType} />)
        return actionMenu
    }, [])

    return (
        <div>
            <BreadCrumb breadCrumbData={breadCrumbData} />
            <Card className="py-0 rounded shadow-sm gap-1">
                <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
                    <div className='flex justify-between items-center mb-2'>
                        <h4 className='font-semibold text-xl'>Product Variant</h4>
                        <Button>
                            <FiPlus />
                            <Link href={ADMIN_PRODUCT_VARIANT_ADD}> New Product Variant
                            </Link>
                        </Button>
                    </div>

                </CardHeader>
                <CardContent className='pb-5 px-0'>
                    <DataTableWrapper
                        queryKey='product-variant-data'
                        fetchUrl="/api/product-variant"
                        initialPageSize={10}
                        columnsConfig={columns}
                        exportEndPoint="/api/product-variant/export"
                        deleteEndPoint='/api/product-variant/delete'
                        deleteType="SD"
                        trashView={`${ADMIN_TRASH}?trashof=productVariant`}
                        createAction={action} />
                </CardContent >
            </Card >
        </div>
    )
}

export default AllProductVariant