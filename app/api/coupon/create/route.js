import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import { zSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/Coupon.model";

export async function POST(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            throw new Error('Unauthorized access')
        }

        await connectDB()

        const payload = await request.json()

        const schema = zSchema.pick({
            code: true,
            discountPercentage: true,
            minShoppingAmount: true,
            validity: true,
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields.', validate.error)
        }

        const couponData = validate.data

        const newCoupon = new CouponModel({
            code: couponData.code,
            minShoppingAmount: couponData.minShoppingAmount,
            discountPercentage: couponData.discountPercentage,
            validity: couponData.validity
        })

        await newCoupon.save()

        return response(true, 200, 'Coupon created successfully.')

    } catch (error) {
        return catchError(error)
    }
}
