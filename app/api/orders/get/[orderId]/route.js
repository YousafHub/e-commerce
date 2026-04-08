import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import OrderModel from "@/models/Order.model";
import MediaModel from "@/models/Media.model";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function GET(requests, { params }) {
    try {
        await connectDB()
        const getParams = await params
        const orderId = getParams.orderId

        if(!orderId) {
            return response(false, 404, 'Order not found')
        }

        const orderData = await OrderModel.findOne({ _id: orderId }).populate('products.productId', 'name slug').populate({
            path: 'products.variantId',
            populate: {path: 'media'}
        }).lean()

        if(!orderData) {
            return response(false, 400, 'Ordern not found')
        }

        return response(true, 200, 'Order found', orderData)
    } catch (error) {
        return catchError(error)
    }
}