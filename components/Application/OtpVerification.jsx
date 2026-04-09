import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import LoadedButton from './LoadedButton'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

const OtpVerification = ({ email, onSubmit, loading }) => {

    const formSchema = zSchema.pick({
        email: true,
        otp: true
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: email,
            otp: ""
        }
    })

    const handleOtpVerification = async (data) => {

    }

    return (
        <div>
            <form onSubmit={form.handleSubmit(handleOtpVerification)} className="space-y-4">
                < div className='mb-5'>
                    <label>OTP</label>
                    <InputOTP maxLength={6}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>
                <div>
                    <LoadedButton
                        type="submit"
                        text="Login"
                        loading={loading}
                        className="cursor-pointer p-5 w-full mt-2 text-[17px] hover:opacity-80 mb-3" />
                </div>
            </form>
        </div>
    )
}

export default OtpVerification