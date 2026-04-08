import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import { isValidObjectId } from "mongoose";
import { isAuthenticated } from "@/lib/authentication";
import MediaModel from "@/models/Media.model";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function GET(request, { params }) {
    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth) {
            throw new Error('Unauthorized access')
        }
        await connectDB()

        const getParams = await params
        const id = getParams.id

        const filter = {
            deletedAt: null
        }

        if(!isValidObjectId(id)) {
            return response(false, 400, 'Invalid object ID')
        }

        filter._id = id 

        const getProductVariant = await ProductVariantModel.findOne(filter).populate('media', '_id secure_url').lean()
        if(!getProductVariant) {
            return response(false, 404, 'Product Variant not found')
        }

        return response(true, 200, 'Product Variant fetched successfully', getProductVariant)
    } catch (error) {
        return catchError(error)
    }
}