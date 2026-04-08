import { zSchema } from '@/lib/zodSchema'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import ButtonLoading from './ButtonLoading'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { zodResolver } from '@hookform/resolvers/zod'
import { showToast } from '@/lib/showToast'
import axios from 'axios'

const OTPVerification = ({ email, onSubmit, loading }) => {

    const [isResendingOtp, setIsResendingOtp] = useState(false)

    const formSchema = zSchema.pick({
        email: true,
        otp: true
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: email || '',
            otp: ''
        }
    })

    const handleOtpVerification = async (values) => {
        onSubmit(values)
    }

    const resendOTP = async () => {
        try {
            setIsResendingOtp(true)
            const { data: resendOtpResponse } = await axios.post('/api/auth/resend-otp', { email })
            if (!resendOtpResponse.success) {
                throw new Error(resendOtpResponse.message)
            }

            showToast('success', resendOtpResponse.message)
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setIsResendingOtp(false)
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleOtpVerification)}>
                    <div className='text-center'>
                        <h1 className='text-2xl font-bold mb-2'>Please complete the verification</h1>
                        <p className='text-md'>We've sent One-time Password to your email {email}. The OPT is valid for 10 minutes only.</p>
                    </div>
                    <div className='my-5 flex justify-center'>
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">One-time Password</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot className="text-xl size-10" index={0} />
                                                <InputOTPSlot className="text-xl size-10" index={1} />
                                                <InputOTPSlot className="text-xl size-10" index={2} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot className="text-xl size-10" index={3} />
                                                <InputOTPSlot className="text-xl size-10" index={4} />
                                                <InputOTPSlot className="text-xl size-10" index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='mb-3'>
                        <ButtonLoading loading={loading} type='submit' text="Verify" className="w-full" />
                        <div className='text-center mt-5 text-blue-500 cursor-pointer hover:underline'>
                            {
                                !isResendingOtp ?
                                    <button onClick={resendOTP} type='button'>Resend OTP</button>

                                : 
                                <span className='text-md'>Resending...</span>
                            }
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default OTPVerification