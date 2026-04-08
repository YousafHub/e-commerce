import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import { isAuthenticated } from "@/lib/authentication";
import OrderModel from "@/models/Order.model";

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

        const getOrders = await OrderModel.find(filter).select("-products").sort({ createdAt: -1 }).lean()

        if(!getOrders) {
            return response(false, 404, 'Collection empty')
        }

        return response(true, 200, 'Data found', getCoupon)

    } catch (error) {
        return catchError(error)
    }
}