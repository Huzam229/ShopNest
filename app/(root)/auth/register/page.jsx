'use client'
import { Card, CardContent } from '@/components/ui/card'
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
import Link from 'next/link';
import { WEBSITE_LOGIN } from '@/routes/WebRoutes';

const formSchema = zSchema.pick({
    name: true,
    email: true,
    password: true
}).extend({
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})
const RegisterPage = () => {

    const [loading, setloading] = useState(false);
    const [isTypePassword, setIsTypePassword] = useState(true)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
    });
    const handleRegisterSubmit = async (data) => {
        setloading(true)
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password
                })
            })
            console.log(res)
            const result = await res.json();
            console.log(result)
            if (!result.success) {
                throw new Error(result.message)
            }
            alert(result.message)
            form.reset();
        } catch (error) {
            alert(error.message)
        } finally {
            setloading(false)
        }
    }
    return (
        <Card className='w-[440px]'>
            <CardContent>
                <div className='flex justify-center'>
                    <Image src={Logo.src} width={Logo.width} height={Logo.height} alt="Logo" className='max-w-[150px]' />
                </div>
                <div className='text-center'>
                    <h1 className='text-2xl font-bold'>Create Account</h1>
                    <p className='text-muted-foreground text-lg'>Create new account by filling the form below</p>
                </div>
                <div className='mt-5'>
                    <form onSubmit={form.handleSubmit(handleRegisterSubmit)} className="space-y-4">
                        < div className='mb-5'>
                            <label>Full Name</label>
                            <Input className={`p-5`} placeholder="Full Name" {...form.register("name")} type='text' />
                            {form.formState.errors.name && (
                                <p className="text-red-500 text-sm">
                                    {form.formState.errors.name.message}
                                </p>
                            )}
                        </div>
                        < div className='mb-5'>
                            <label>Email</label>
                            <Input className={`p-5`} placeholder="example@gmail.com" {...form.register("email")} type='email' />
                            {form.formState.errors.email && (
                                <p className="text-red-500 text-sm">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className='relative'>
                            <label>Password</label>
                            <Input className={`p-5`} type={isTypePassword ? 'password' : 'text'} placeholder="********" {...form.register("password")} />
                            {form.formState.errors.password && (
                                <p className="text-red-500 text-sm">
                                    {form.formState.errors.password.message}
                                </p>
                            )}
                        </div>
                        <div className='relative'>
                            <label>Confirm Password</label>
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
                                text="Register"
                                loading={loading}
                                className="cursor-pointer p-5 w-full mt-2 text-[17px] hover:opacity-80 mb-3" />
                        </div>
                        <div className='text-center'>
                            <div className='flex items-center justify-center gap-1'>
                                <p>Already have an account?</p>
                                <Link href={WEBSITE_LOGIN} className='text-primary underline'>Login</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </CardContent>
        </Card>
    )
}

export default RegisterPage