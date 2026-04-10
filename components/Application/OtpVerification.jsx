"use client";

import { zSchema } from '@/lib/zodSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import LoadedButton from './LoadedButton';

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

const OtpVerification = ({ email, onSubmit, otpVerificationloading }) => {

    const form = useForm({
        resolver: zodResolver(zSchema.pick({ email: true, otp: true })),
        defaultValues: {
            email: email || "",
            otp: ""
        },
        mode: "onChange",
        shouldUnregister: false,
    });

    // Sync email
    useEffect(() => {
        if (email) {
            form.setValue("email", email, { shouldValidate: true });
        }
    }, [email]);

    const handleOtpVerification = async (data) => {
        await onSubmit(data);
    };

    return (
        <div>
            <form
                onSubmit={form.handleSubmit(handleOtpVerification)}
                className="space-y-6"
            >

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        Please Complete Verification
                    </h1>
                    <p className="text-muted-foreground">
                        We have sent an OTP to <span className="font-medium">{email}</span>.
                        <br />
                        OTP is valid for 10 minutes.
                    </p>
                </div>

                {/* OTP FIELD */}
                <div className="flex flex-col items-center">
                    <div className="mb-3 font-semibold">
                        One-time Password (OTP)
                    </div>

                    <Controller
                        name="otp"
                        control={form.control}
                        rules={{
                            required: "Please enter the 6-digit OTP",
                            minLength: {
                                value: 6,
                                message: "OTP must be 6 digits"
                            }
                        }}
                        render={({ field }) => (
                            <InputOTP
                                maxLength={6}
                                value={(field.value || "").slice(0, 6)}
                                onChange={(value) => {
                                    const clean = value.replace(/[^0-9]/g, '').slice(0, 6);
                                    field.onChange(clean);
                                }}
                                autoFocus
                            >
                                <InputOTPGroup className="gap-3">
                                    <InputOTPSlot index={0} className="text-2xl size-12 border-2" />
                                    <InputOTPSlot index={1} className="text-2xl size-12 border-2" />
                                    <InputOTPSlot index={2} className="text-2xl size-12 border-2" />
                                    <InputOTPSlot index={3} className="text-2xl size-12 border-2" />
                                    <InputOTPSlot index={4} className="text-2xl size-12 border-2" />
                                    <InputOTPSlot index={5} className="text-2xl size-12 border-2" />
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
                        className="w-full p-6 text-[17px]"
                    />

                    <div className="flex justify-center">
                        <button
                            type="button"
                            className="text-blue-600 hover:underline text-sm font-medium"
                            onClick={() => alert("Resend OTP coming soon")}
                        >
                            Resend OTP
                        </button>
                    </div>

                </div>

            </form>
        </div>
    );
};

export default OtpVerification;