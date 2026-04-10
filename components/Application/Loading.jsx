import React from 'react'
import loading from '@/public/assets/images/loading.svg'
import Image from 'next/image'

const Loading = () => {
    return (
        <div className='flex items-start mt-12 justify-center h-screen w-screen'>
            <Image src={loading.src} height={80} width={80} alt='loading' />
        </div>
    )
}

export default Loading