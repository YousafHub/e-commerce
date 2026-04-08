import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDB } from "@/lib/databaseConnection"
import { catchError, response } from "@/lib/helperfunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";

export async function POST(request) {
    try {
        await connectDB();
        const validationSchema = zSchema.pick({
            name: true,
            email: true,
            password: true
        })

        const payload = await request.json();
        const validatedData = validationSchema.safeParse(payload)

        if(!validatedData.success) {
            return response(false, 401, 'Invalid or missing input', validatedData.error)
        }

        const { name, email, password } = validatedData.data;

        const checkUser = await UserModel.exists({ email })
        if(checkUser) {
            return response(true, 409, 'User already registered')
        }


        const newRegistration = new UserModel({
            name,
            email,
            password
        })

        await newRegistration.save()

        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        
        const token = await new SignJWT({ userId: newRegistration._id.toString() }).setIssuedAt().setExpirationTime('1h').setProtectedHeader({ alg: 'HS256' }).sign(secret)

        await sendMail('Email Verification request from Yousaf Shahid', email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`))

        return response(true, 200, 'Registration success, Please verify your email address')
    } catch (error) {
        return catchError(error)
    }
}