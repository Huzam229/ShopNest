import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_CATEGORY, ADMIN_DASHBOARD } from '@/routes/AdminPanelRoutes'
import React from 'react'


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
            label: "All Category"
        },
    ]

const ShowCategory = () => {
    return (
        <div>
            <BreadCrumb breadCrumbData={breadCrumbData} />
        </div>
    )
}

export default ShowCategory