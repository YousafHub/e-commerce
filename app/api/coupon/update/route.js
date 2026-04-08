import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import { zSchema } from "@/lib/zodSchema";
import { isValidObjectId } from "mongoose";
import { isAuthenticated } from "@/lib/authentication";
import CouponModel from "@/models/Coupon.model";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            throw new Error('Unauthorized access')
        }
        await connectDB()

        const payload = await request.json()

      const schema = zSchema.pick({
            _id: true,
            code: true,
            discountPercentage: true,
            minShoppingAmount: true,
            validity: true,
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields', validate.error)
        }

        const validatedData = validate.data
        if (!isValidObjectId(validatedData._id)) {
            return response(false, 400, 'Invalid object ID')
        }


        const getCoupon = await CouponModel.findOne({
            deletedAt: null,
            _id: validatedData._id
        })
        if (!getCoupon) {
            return response(false, 404, 'Data not found')
        }

        getCoupon.code = validatedData.code
        getCoupon.validity = validatedData.validity
        getCoupon.discountPercentage = validatedData.discountPercentage
        getCoupon.minShoppingAmount = validatedData.minShoppingAmount

        await getCoupon.save()

        return response(true, 200, 'Coupon updated successfully')


    } catch (error) {
        return catchError(error)
    }
}