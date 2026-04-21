import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ADMIN_MEDIA, ADMIN_MEDIA_EDIT } from '@/routes/AdminPanelRoutes'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdOutlineEdit } from 'react-icons/md';
import { IoIosLink } from 'react-icons/io';
import { LuTrash } from 'react-icons/lu';
import { showToast } from '@/lib/showToast'



const Media = ({ media, handleDelete, deleteType, selectedMedia, setSelectedMedia }) => {


    const handleCheck = () => {
        let newSelectedMedia = [];
        if (selectedMedia.includes(media._id)) {
            newSelectedMedia = selectedMedia.filter(m => m !== media._id)
        } else {
            newSelectedMedia = [...selectedMedia, media._id]
        }
        setSelectedMedia(newSelectedMedia)
        console.log(newSelectedMedia)
    }


    const handleCopyLink = async (url) => {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(url);
                showToast('success', 'Link Copied');
                return;
            }
            const textarea = document.createElement("textarea");
            textarea.value = url;
            textarea.setAttribute("readonly", "");
            textarea.style.position = "fixed";
            textarea.style.top = "0";
            textarea.style.left = "0";
            textarea.style.width = "1px";
            textarea.style.height = "1px";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            setTimeout(() => {
                textarea.focus();
                textarea.select();
                textarea.setSelectionRange(0, textarea.value.length);
                const success = document.execCommand("copy");
                document.body.removeChild(textarea);
                showToast(success ? 'success' : 'error', success ? 'Link Copied' : 'Copy Failed');
            }, 100);

        } catch (error) {
            console.log("Copy Failed", error)
        }
    };

    return (
        <div className='border border-gray-200 dark:border-gray-800 relative group 
        rounded overflow-hidden'>
            <div className='absolute top-2 left-2 z-20'>
                <Checkbox checked={selectedMedia.includes(media._id)}
                    onCheckedChange={() => handleCheck()}
                    className='border-2 border-primary cursor-pointer' />
            </div>
            <div className='absolute top-2 right-2 z-20'>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <span className='w-7 h-7 flex items-center justify-center rounded-full bg-black/50 cursor-pointer'>
                            <BsThreeDotsVertical color='#fff' />
                        </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start'>
                        {
                            deleteType === 'SD' &&
                            <>
                                <DropdownMenuItem asChild className="cursor-pointer flex items-center gap-2">
                                    <Link href={ADMIN_MEDIA_EDIT(media._id)}>
                                        <MdOutlineEdit />
                                        <span>Edit</span>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => handleCopyLink(media.secure_url)} className="cursor-pointer flex items-center gap-2">
                                    <IoIosLink />
                                    <span>Copy Link</span>
                                </DropdownMenuItem>
                            </>
                        }

                        <DropdownMenuItem onClick={() => handleDelete([media._id], deleteType)} className="cursor-pointer flex items-center gap-2">
                            <LuTrash className="text-red-500" />
                            <span>
                                {deleteType === 'SD'
                                    ? 'Move Into Trash'
                                    : 'Delete Permanently'}
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className='absolute h-full w-full z-10 translate-all duration-150 ease-in group-hover:bg-black/30'></div>
            <div>
                <Image src={media?.secure_url}
                    height={300}
                    width={300}
                    alt={media?.alt || 'Media Image'}
                    className='object-cover w-full sm:h-[200px] h-[150px]' />
            </div>


        </div>
    )
}

export default Media