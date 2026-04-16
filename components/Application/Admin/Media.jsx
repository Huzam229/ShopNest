import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import React from 'react'

const Media = ({ media, handleDelete, deleteType, selectedMedia, setSelectedMedia }) => {


    const handleChange = () => {

    }

    return (
        <div className='border border-gray-200 dark:border-gray-800 relative group 
        rounded overflow-hidden'>
            <div className='absolute top-2 left-2 z-20'>
                <Checkbox checked={selectedMedia.includes(media._id)}
                    onCheckedChange={handleChange} className='border-2 border-gray-400' />
            </div>
            <div>
                <Image src={media?.secure_url}
                    height={300}
                    width={300}
                    alt={media?.alt || 'Media Image'}
                    className='object-cover w-full sm:h-[200px] h-[150px]:' />
            </div>


        </div>
    )
}

export default Media