import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import MediaModel from "@/models/Media.model";
import OrderModel from "@/models/Order.model";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function GET() {
    try {
        await connectDB()
        const auth = await isAuthenticated('user')
        if(!auth.isAuth) {
            throw new Error('Unauthorized Access')
        }

        const userId = auth.userId

        // get recent orders
        const recentOrders = await OrderModel.find({ user: userId }).populate('products.productId', 'name slug').populate({
            path: 'products.variantId',
            populate: {path: 'media'}
        }).lean()


        // get total order counts
        const totalOrder = await OrderModel.countDocuments({ user: userId })

        return response(true, 200, 'Dashboard Info', {recentOrders, totalOrder})

    } catch (error) {
        return catchError(error)
    }
}