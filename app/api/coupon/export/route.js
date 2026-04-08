import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import { isAuthenticated } from "@/lib/authentication";
import CouponModel from "@/models/Coupon.model";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth) {
            throw new Error('Unauthorized access')
        }
        await connectDB()

        const filter = {
            deletedAt: null
        }

        const getCoupon = await CouponModel.find(filter).sort({ createdAt: -1 }).lean()

        if(!getCoupon) {
            return response(false, 404, 'Collection empty')
        }

        return response(true, 200, 'Data found', getCoupon)

    } catch (error) {
        return catchError(error)
    }
}