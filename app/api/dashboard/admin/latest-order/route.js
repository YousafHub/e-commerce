import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import OrderModel from "@/models/Order.model";

export async function GET() {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            throw new Error('Unauthorized access')
        }

        await connectDB()

        const latestOrder = await OrderModel.find({ deletedAt: null }).sort({ createdAt: -1 }).limit(20).lean()

        return response(true, 200, 'Data found', latestOrder)
    } catch (error) {
        return catchError(error)
    }
}