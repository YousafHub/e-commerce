import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import { isValidObjectId } from "mongoose";
import { isAuthenticated } from "@/lib/authentication";
import CategoryModel from "@/models/Category.model";

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

        const getCategory = await CategoryModel.findOne(filter).lean()
        if(!getCategory) {
            return response(false, 404, 'Category not found')
        }

        return response(true, 200, 'Category fetched successfully', getCategory)
    } catch (error) {
        return catchError(error)
    }
}