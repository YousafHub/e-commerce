import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, generateOTP, response } from "@/lib/helperfunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import z from "zod";

export async function POST(request) {
    try {
        await connectDB();
        const payload = await request.json();

        const validationSchema = zSchema.pick({
            email: true
        }).extend({
            password: z.string()
        })

        const validatedData = validationSchema.safeParse(payload)
        if (!validatedData.success) {
            return response(false, 401, 'Invalid or missing input', validatedData.error)
        }

        const { email, password } = validatedData.data

        // get user from database
        const getUser = await UserModel.findOne({ deletedAt: null, email }).select('+password')
        if (!getUser) {
            return response(false, 400, 'Invalid Login credentials')
        }

        // resend email verification link if not verified
        if (!getUser.isEmailVerified) {
            const secret = new TextEncoder().encode(process.env.SECRET_KEY);
            const token = await new SignJWT({ userId: getUser._id.toString() }).setIssuedAt().setExpirationTime('1h').setProtectedHeader({ alg: 'HS256' }).sign(secret)
            await sendMail('Email Verification request from Yousaf Shahid', email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`))

            return response(false, 401, 'Your email is not verified. We have sent you another verification link. Please verify your email to login.')
        }

        const isPasswordVerified = await getUser.comparePassword(password)

        if (!isPasswordVerified) {
            return response(false, 400, 'Invalid Login credentials')
        }

        // otp
        
        await OTPModel.deleteMany({ email })

        const otp = generateOTP()

        const newOtpData = new OTPModel({
            email, otp
        })

        await newOtpData.save()

        const otpEmailStatus = await sendMail('Your login verification code', email, otpEmail(otp))

        if(!otpEmailStatus.success) {
            return response(false, 500, 'Failed to send OTP email.')
        }

        return response(true, 200, 'OTP has been sent to your email.')
    } catch (error) {
        return catchError(error)
    }
}