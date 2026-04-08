import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function GET() {
    try {
        await connectDB()

        const getColors = await ProductVariantModel.distinct('color')
        if(!getColors) {
            return response(false, 404, 'Colors not found')
        }

        return response(true, 200, 'Colors fetched successfully', getColors)
    } catch (error) {
        return catchError(error)
    }
}