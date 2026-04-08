import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import { zSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/Coupon.model";

export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json()

        const couponFormSchema = zSchema.pick({
            couponCode: true,
            minShoppingAmount: true
        })

        const validate = couponFormSchema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Missing or Invalid Data', validate.error)
        }

        const { couponCode, minShoppingAmount } = validate.data

        const couponData = await CouponModel.findOne({ code: couponCode }).lean()
        if (!couponData) {
            return response(false, 400, 'Invalid or expired coupon code')
        }

        if (new Date() > couponData.validity) {
            return response(false, 400, 'Coupon code expired')
        }

        if (minShoppingAmount < couponData.minShoppingAmount) {
            return response(false, 400, 'Insufficient shopping amount')
        }

        return response(true, 200, "Message coupon applied", { discountPercentage: couponData.discountPercentage })

    } catch (error) {
        return catchError(error)
    }
}