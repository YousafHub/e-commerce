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

        const orderStatus = await OrderModel.aggregate([
            {
                $match: {
                    deletedAt: null,
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                }
            },
            {
                $sort: { count: 1 }
            }
        ])

        return response(true, 200, 'Data found', orderStatus)
    } catch (error) {
        return catchError(error)
    }
}