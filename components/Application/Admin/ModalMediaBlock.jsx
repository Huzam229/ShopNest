import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import React from 'react'

const ModalMediaBlock = ({ media, selectedMedia, setSelectedMedia, isMultiple }) => {

    const handleCheck = () => {
        const isSelected = selectedMedia.some(m => m._id === media._id);

        if (isMultiple) {
            if (isSelected) {
                setSelectedMedia(selectedMedia.filter(m => m._id !== media._id));
            } else {
                setSelectedMedia([...selectedMedia, { _id: media._id, secure_url: media.secure_url }]);
            }
        } else {
            setSelectedMedia([{ _id: media._id, secure_url: media.secure_url }]);
        }
    };
    return (
        <div>
            <label htmlFor={media._id} className='border border-gray-200 dark:border-gray-800 
            relative group rounded overflow-hidden'>
                <div className='absolute top-0.5 left-2 z-20'>
                    <Checkbox id={media._id}
                        checked={selectedMedia.find(m => m._id === media._id) ? true : false}
                        onCheckedChange={handleCheck}
                        className='border-2 border-primary cursor-pointer dark:border-white'
                    />
                </div>
                <div className='relative size-full'>
                    <Image src={media.secure_url}
                        width={300}
                        height={300}
                        alt={media?.alt || ''}
                        className='object-cover md:h-[150px] h-[100px]' />
                </div>
            </label>
        </div>
    )
}

export default ModalMediaBlock