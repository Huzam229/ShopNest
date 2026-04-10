"use client";
import { zSchema } from '@/lib/zodSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import LoadedButton from './LoadedButton';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { showToast } from '@/lib/showToast';

const OtpVerification = ({ email, onSubmit, otpVerificationloading }) => {

    console.log(email)
    const [isResendOtp, setIsResendOtp] = useState(false)

    const formSchema = zSchema.pick({
        email: true,
        otp: true
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: email || "",
            otp: ""
        },
        mode: "onChange" // Better real-time validation
    });

    const handleOtpVerification = async (data) => {
        await onSubmit(data);
    };

    const resendOTP = async () => {
        try {
            setIsResendOtp(true)
            const res = await fetch("/api/auth/resend-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                })
            })
            const result = await res.json();
            if (!result.success) {
                throw new Error(result.message)
            }
            showToast("success", result.message)
        } catch (error) {
            showToast("error", error.message)
        } finally {
            setIsResendOtp(false)
        }

    }

    return (
        <div>
            <form onSubmit={form.handleSubmit(handleOtpVerification)} className="space-y-6">

                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        Please Complete Verification
                    </h1>
                    <p className="text-muted-foreground text-md">
                        We have sent an OTP to <span className="font-medium">{email}</span>.<br />
                        OTP is valid for 10 minutes.
                    </p>
                </div>

                <div className="flex flex-col items-center pointer-events-auto">
                    <div className="mb-2 font-semibold text-center">
                        One-time Password (OTP)
                    </div>

                    <Controller name="otp"
                        control={form.control}
                        rules={{
                            required: "Please enter the 6-digit OTP",
                            minLength: { value: 6, message: "OTP must be 6 digits" }
                        }}
                        render={({ field }) => (
                            <InputOTP maxLength={6}
                                value={(field.value || "").slice(0, 6)}
                                onChange={(value) => {
                                    const clean = value.replace(/[^0-9]/g, '').slice(0, 6);
                                    field.onChange(clean);
                                    console.log(value)
                                }}
                            >
                                <InputOTPGroup className={`gap-2`}>
                                    <InputOTPSlot index={0} className="text-xl size-12 border-2" />
                                    <InputOTPSlot index={1} className="text-xl size-12 border-2" />
                                    <InputOTPSlot index={2} className="text-xl size-12 border-2" />
                                    <InputOTPSlot index={3} className="text-xl size-12 border-2" />
                                    <InputOTPSlot index={4} className="text-xl size-12 border-2" />
                                    <InputOTPSlot index={5} className="text-xl size-12 border-2" />
                                </InputOTPGroup>
                            </InputOTP>
                        )}
                    />

                    {form.formState.errors.otp && (
                        <p className="text-red-500 text-sm mt-2 text-center">
                            {form.formState.errors.otp.message}
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    <LoadedButton
                        type="submit"
                        text="Verify OTP"
                        loading={otpVerificationloading}
                        className="w-full p-6 text-[17px] hover:opacity-90"
                    />

                    <div className="flex justify-center">
                        {!isResendOtp ? <button
                            type="button"
                            className="text-blue-600 hover:underline text-sm font-medium cursor-pointer"
                            onClick={resendOTP}
                        >
                            Resend OTP
                        </button> : <span className='text-md'>Resending....</span>}

                    </div>
                </div>
            </form >
        </div >
    );
};

export default OtpVerification;