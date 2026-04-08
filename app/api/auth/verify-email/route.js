import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import UserModel from "@/models/User.model";
import { jwtVerify } from "jose";
import { isValidObjectId } from "mongoose";

export async function POST(request) {
   try {
      await connectDB()
      const { token } = await request.json()

      if (!token) {
         return response(false, 400, 'Token missing')
      }

      const secret = new TextEncoder().encode(process.env.SECRET_KEY)
      const decoded = await jwtVerify(token, secret)

      const userId = decoded.payload.userId;


      const user = await UserModel.findById(userId);
      if (!user) {
         return response(false, 404, 'User not found')
      }

      user.isEmailVerified = true
      await user.save()

      return response(true, 200, 'Email verified successfully')
   } catch (error) {
      return catchError(error)
   }
}