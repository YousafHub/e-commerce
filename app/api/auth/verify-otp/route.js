import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(request) {
   try {
      await connectDB()
      const payload = await request.json()
      
      const validationSchema = zSchema.pick({
        email: true,
        otp: true
      })

      const validatedData = validationSchema.safeParse(payload)
      if(!validatedData.success) {
        return response(false, 401, 'Invalid or missing input field', validatedData.error)
      }

      const { email, otp } = validatedData.data

      const getOtpData = await OTPModel.findOne({ email, otp })

      if(!getOtpData) {
        return response(false, 401, 'Invalid or expired OTP')
      }

      const getUser = await UserModel.findOne({ deletedAt: null, email }).lean()

      if(!getUser) {
        return response(false, 404, 'User not found')
      }

      const loggedInUserData = {
        _id: getUser._id.toString(),
        role: getUser.role,
        name: getUser.name,
        avatar: getUser.avatar,
      }

      const secret = new TextEncoder().encode(process.env.SECRET_KEY)
      const token = await new SignJWT(loggedInUserData)
      .setIssuedAt()
      .setExpirationTime('1d')
      .setProtectedHeader({ alg: 'HS256'})
      .sign(secret)

      const cookieStore = await cookies()
      cookieStore.set({
        name: 'access_token',
        value: token,
        httpOnly: process.env.NODE_ENV === 'production',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })


      // removing otp after validation
      await getOtpData.deleteOne({ email, otp })

      return response(true, 200, 'OTP verified successfully', loggedInUserData)
   
   } catch (error) {
      return catchError(error)
   }
}