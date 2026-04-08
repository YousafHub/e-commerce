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

        const monthlySales = await OrderModel.aggregate([
            {
                $match: {
                    deletedAt: null,
                    status: {$in: ['delivered', 'processing', 'shipped']}
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt"},
                        month: { $month: "$createdAt"}
                    },
                    totalSales: { $sum: "$totalAmount" },
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1}
            }
        ])

        return response(true, 200, 'Data found', monthlySales)
    } catch (error) {
        return catchError(error)
    }
}