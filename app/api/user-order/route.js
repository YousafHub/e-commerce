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

        const orders = await OrderModel.find({ user: userId }).populate('products.productId', 'name slug').populate({
            path: 'products.variantId',
            populate: {path: 'media'}
        }).limit(10).lean()

        return response(true, 200, 'Order Info', orders)

    } catch (error) {
        return catchError(error)
    }
}