import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";

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

      // removing otp after validation
      await getOtpData.deleteOne({ email, otp })

      return response(true, 200, 'OTP verified successfully')
   
   } catch (error) {
      return catchError(error)
   }
}