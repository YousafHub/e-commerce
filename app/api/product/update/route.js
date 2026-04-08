import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import { zSchema } from "@/lib/zodSchema";
import { isValidObjectId } from "mongoose";
import { isAuthenticated } from "@/lib/authentication";
import ProductModel from "@/models/Product.model";
import { encode } from "entities";

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
            name: true,
            slug: true,
            category: true,
            mrp: true,
            sellingPrice: true,
            discountPercentage: true,
            description: true,
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


        const getProduct = await ProductModel.findOne({
            deletedAt: null,
            _id: validatedData._id
        })
        if (!getProduct) {
            return response(false, 404, 'Data not found')
        }

        getProduct.name = validatedData.name
        getProduct.slug = validatedData.slug
        getProduct.category = validatedData.category
        getProduct.mrp = validatedData.mrp
        getProduct.sellingPrice = validatedData.sellingPrice
        getProduct.discountPercentage = validatedData.discountPercentage
        getProduct.description = encode(validatedData.description)
        getProduct.media = validatedData.media

        await getProduct.save()

        return response(true, 200, 'Product updated successfully')


    } catch (error) {
        return catchError(error)
    }
}