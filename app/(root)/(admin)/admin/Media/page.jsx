'use client'

import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import UploadMedia from '@/components/Application/Admin/UploadMedia'
import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoutes'
import React from 'react'

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


    return (
        <div>
            <BreadCrumb breadCrumbData={breadcrumb} />
            <UploadMedia />
        </div>
    )
}

export default MediaPage