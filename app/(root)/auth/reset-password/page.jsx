"use client"
import { Card, CardContent } from '@/components/ui/card'
import { Input } from "@/components/ui/input";
import Logo from "@/public/assets/images/logo-black.png";
import Image from 'next/image'
import LoadedButton from '@/components/Application/LoadedButton';
import { zSchema } from '@/lib/zodSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { WEBSITE_LOGIN } from '@/routes/WebRoutes';
import Link from 'next/link';
import { showToast } from '@/lib/showToast';
import OtpVerification from '@/components/Application/OtpVerification';
import ResetPasswordComponent from '@/components/Application/ResetPasswordComponent';

const ResetPassword = () => {

    const [passwordResetLoading, setPasswordResetLoading] = useState(false);
    const [otpVerificationloading, setOtpVerificationloading] = useState(false);
    const [otpEmail, setOtpEmail] = useState(null)
    const [isOTPVerfied, setIsOTPVerfied] = useState(false)

    const formSchema = zSchema.pick({
        email: true
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        }
    })

    const handlePasswordReset = async (data) => {
        setPasswordResetLoading(true)
        try {
            const res = await fetch("/api/auth/reset-password/send-otp", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                })
            })
            const result = await res.json();
            if (!result.success) {
                throw new Error(result.message)
            }
            setOtpEmail(data.email)
            showToast("success", result.message)
        } catch (error) {
            showToast("error", error.message)
        } finally {
            setPasswordResetLoading(false)
        }

    }

    const handleOtpVerification = async (data) => {
        try {
            setOtpVerificationloading(true)
            const res = await fetch("/api/auth/reset-password/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    otp: data.otp
                })
            })
            const result = await res.json();
            if (!result.success) {
                throw new Error(result.message)
            }
            showToast("success", result.message)
            setIsOTPVerfied(true)
        } catch (error) {
            showToast("error", error.message)
        } finally {
            setOtpVerificationloading(false)
        }
    }

    return (
        <Card className='w-[440px]'>
            <CardContent>
                <div className='flex justify-center'>
                    <Image src={Logo.src} width={Logo.width} height={Logo.height} alt="Logo" className='max-w-[150px]' />
                </div>

                {
                    !otpEmail ? <>
                        <div className='text-center'>
                            <h1 className='text-2xl font-bold'>Reset Password</h1>
                            <p className='text-muted-foreground text-lg'>Enter your email address to verify your account</p>
                        </div>
                        <div className='mt-5'>
                            <form onSubmit={form.handleSubmit(handlePasswordReset)} className="space-y-4">
                                <div className='mb-5'>
                                    <label className='mb-1 block'>Email</label>
                                    <Input className={`p-5`} placeholder="example@gmail.com" {...form.register("email")} />
                                    {form.formState.errors.email && (
                                        <p className="text-red-500 text-sm">
                                            {form.formState.errors.email.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <LoadedButton
                                        type="submit"
                                        text="Reset Password"
                                        loading={passwordResetLoading}
                                        className="cursor-pointer p-5 w-full mt-2 text-[17px] hover:opacity-80 mb-3" />
                                </div>
                                <div className='text-center'>
                                    <div className='flex items-center justify-center gap-1'>
                                        <Link href={WEBSITE_LOGIN} className='text-primary underline'>Back to login</Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </> :
                        <>
                            {
                                // otp Form 
                                !isOTPVerfied ?
                                    <OtpVerification email={otpEmail} onSubmit={handleOtpVerification} otpVerificationloading={otpVerificationloading} />
                                    : <ResetPasswordComponent email={otpEmail} />
                            }
                        </>
                }
            </CardContent>
        </Card>
    )
}

export default ResetPassword