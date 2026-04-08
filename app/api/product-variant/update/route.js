import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import { zSchema } from "@/lib/zodSchema";
import { isValidObjectId } from "mongoose";
import { isAuthenticated } from "@/lib/authentication";
import ProductVariantModel from "@/models/ProductVariant.model";

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
            product: true,
            sku: true,
            color: true,
            size: true,
            mrp: true,
            sellingPrice: true,
            discountPercentage: true,
            media: true
        })

        const validate = schema.safeParse(payload)
        if (!validate.success) {
            return response(false, 400, 'Invalid or missing fields', validate.error)
        }

        const validatedData = validate.data
        if (!isValidObjectId(validatedData._id)) {
            return response(false, 400, 'Invalid object ID')
        }


        const getProductVariant = await ProductVariantModel.findOne({
            deletedAt: null,
            _id: validatedData._id
        })
        if (!getProductVariant) {
            return response(false, 404, 'Data not found')
        }

        getProductVariant.product = validatedData.product
        getProductVariant.size = validatedData.size
        getProductVariant.color = validatedData.color
        getProductVariant.sku = validatedData.sku
        getProductVariant.mrp = validatedData.mrp
        getProductVariant.sellingPrice = validatedData.sellingPrice
        getProductVariant.discountPercentage = validatedData.discountPercentage
        getProductVariant.media = validatedData.media

        await getProductVariant.save()

        return response(true, 200, 'Product variant updated successfully')


    } catch (error) {
        return catchError(error)
    }
}