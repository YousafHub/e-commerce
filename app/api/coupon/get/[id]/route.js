import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import { isValidObjectId } from "mongoose";
import { isAuthenticated } from "@/lib/authentication";
import CouponModel from "@/models/Coupon.model";

export async function GET(request, { params }) {
    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth) {
            throw new Error('Unauthorized access')
        }
        await connectDB()

        const getParams = await params
        const id = getParams.id

        const filter = {
            deletedAt: null
        }

        if(!isValidObjectId(id)) {
            return response(false, 400, 'Invalid object ID')
        }

        filter._id = id 

        const getCoupon = await CouponModel.findOne(filter).lean()
        if(!getCoupon) {
            return response(false, 404, 'Coupon not found')
        }

        return response(true, 200, 'Coupon fetched successfully', getCoupon)
    } catch (error) {
        return catchError(error)
    }
}