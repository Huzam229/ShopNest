'use client'
import { Input } from "@/components/ui/input";
import { useState } from 'react'
import Logo from "@/public/assets/images/logo-black.png";
import Image from 'next/image'
import { useForm } from 'react-hook-form';
import { zSchema } from '@/lib/zodSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import LoadedButton from '@/components/Application/LoadedButton';
import { z } from 'zod';
import { FaRegEyeSlash } from 'react-icons/fa';
import { FaRegEye } from 'react-icons/fa6';
import { WEBSITE_LOGIN } from '@/routes/WebRoutes';
import { showToast } from '@/lib/showToast';
import { useRouter } from 'next/navigation';

const formSchema = zSchema.pick({
    password: true
}).extend({
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})
const ResetPasswordComponent = ({ email }) => {

    const [loading, setloading] = useState(false);
    const [isTypePassword, setIsTypePassword] = useState(true)
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
    });
    const handleUpdatePassword = async (data) => {
        setloading(true)
        try {
            const res = await fetch("/api/auth/reset-password/update-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: data.password
                })
            })
            const result = await res.json();
            if (!result.success) {
                throw new Error(result.message)
            }
            showToast('success', result.message)
            router.push(WEBSITE_LOGIN)

        } catch (error) {
            showToast('error', error.message)
        } finally {
            setloading(false)
        }
    }
    return (

        <div>
            <div className='text-center'>
                <h1 className='text-2xl font-bold'>Update Password</h1>
                <p className='text-muted-foreground text-lg'>Create new password by filling the below form.</p>
            </div>
            <div className='mt-5'>
                <form onSubmit={form.handleSubmit(handleUpdatePassword)} className="space-y-4">
                    <div className='relative'>
                        <label className='mb-1 block'>Password</label>
                        <Input className={`p-5`} type={isTypePassword ? 'password' : 'text'} placeholder="********" {...form.register("password")} />
                        {form.formState.errors.password && (
                            <p className="text-red-500 text-sm">
                                {form.formState.errors.password.message}
                            </p>
                        )}
                    </div>
                    <div className='relative'>
                        <label className='mb-1 block'>Confirm Password</label>
                        <Input className={`p-5`} type={isTypePassword ? 'password' : 'text'} placeholder="********" {...form.register("confirmPassword")} />
                        {form.formState.errors.confirmPassword && (
                            <p className="text-red-500 text-sm">
                                {form.formState.errors.confirmPassword.message}
                            </p>
                        )}
                        <span onClick={() => setIsTypePassword(!isTypePassword)} className='absolute right-3 top-8.5 cursor-pointer'>
                            {isTypePassword ? <FaRegEyeSlash className='h-4 w-4' /> : <FaRegEye className='h-4 w-4' />}
                        </span>
                    </div>
                    <div>
                        <LoadedButton
                            type="submit"
                            text="Update Password"
                            loading={loading}
                            className="cursor-pointer p-5 w-full mt-2 text-[17px] hover:opacity-80 mb-3" />
                    </div>

                </form>
            </div>
        </div>

    )
}

export default ResetPasswordComponent