import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { AiOutlineLogout } from 'react-icons/ai'
import React from 'react'
import { showToast } from '@/lib/showToast'
import { useDispatch } from 'react-redux'
import { logout } from '@/store/reducer/authReducer'
import { useRouter } from 'next/navigation'
import { WEBSITE_LOGIN } from '@/routes/WebRoutes'

const LogoutButton = () => {

    const dispatch = useDispatch()
    const router = useRouter()

    const handleLogout = async () => {

        try {

            const res = await fetch("/api/auth/logout", {
                method: "POST",
            })
            const result = await res.json();
            if (!result.success) {
                throw new Error(result.message)
            }
            dispatch(logout())
            showToast("success", result.message)
            router.push(WEBSITE_LOGIN)
        } catch (error) {

            showToast('error', error.message)
        }

    }
    return (
        <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>
            <AiOutlineLogout color='red' />
            Logout
        </DropdownMenuItem>
    )
}

export default LogoutButton