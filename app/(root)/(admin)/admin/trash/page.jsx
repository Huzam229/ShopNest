'use client'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import DataTableWrapper from '@/components/Application/Admin/DataTableWrapper'
import DeleteAction from '@/components/Application/Admin/DeleteAction'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DT_CATEGORY_COLUMN, DT_PRODUCT_COLUMN, DT_PRODUCT_VARIANT_COLUMN } from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import { ADMIN_DASHBOARD, ADMIN_TRASH } from '@/routes/AdminPanelRoutes'
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useMemo } from 'react'


const breadCrumbData =
    [
        {
            href: ADMIN_DASHBOARD,
            label: "Home"
        },
        {
            href: '#',
            label: "Trash"
        },

    ]

const trashConfig = {
    category: {
        title: 'Category Trash',
        columns: DT_CATEGORY_COLUMN,
        fetchUrl: '/api/category',
        exportUrl: '/api/category/export',
        deleteUrl: '/api/category/delete'
    },
    product: {
        title: 'Product Trash',
        columns: DT_PRODUCT_COLUMN,
        fetchUrl: '/api/product',
        exportUrl: '/api/product/export',
        deleteUrl: '/api/product/delete'
    },
    productVariant: {
        title: 'Product Variant Trash',
        columns: DT_PRODUCT_VARIANT_COLUMN,
        fetchUrl: '/api/product-variant',
        exportUrl: '/api/product-variant/export',
        deleteUrl: '/api/product-variant/delete'
    }
}
const Trash = () => {
    const searchParams = useSearchParams();
    const trashOf = searchParams.get('trashof')
    const config = trashConfig[trashOf];

    const columns = useMemo(() => {
        return columnConfig(config.columns, false, false, true)
    }, [])
    const action = useCallback((row, deleteType, handleDelete) => {
        return [<DeleteAction handleDelete={handleDelete} row={row} deleteType={deleteType} />]
    }, [])

    return (
        <div>
            <BreadCrumb breadCrumbData={breadCrumbData} />
            <Card className="py-0 rounded shadow-sm gap-1">
                <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
                    <div className='flex justify-between items-center mb-2'>
                        <h4 className='font-semibold text-xl'>{config.title}</h4>
                    </div>
                </CardHeader>
                <CardContent className='pb-5 px-0'>
                    <DataTableWrapper
                        queryKey={`${trashOf}-data-deleted`}
                        fetchUrl={config.fetchUrl}
                        initialPageSize={10}
                        columnsConfig={columns}
                        exportEndPoint={config.exportUrl}
                        deleteEndPoint={config.deleteUrl}
                        deleteType="PD"
                        createAction={action} />
                </CardContent >
            </Card >
        </div>
    )
}

export default Trash