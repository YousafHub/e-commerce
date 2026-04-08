import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import MediaModel from "@/models/Media.model";
import { isValidObjectId } from "mongoose";
import { isAuthenticated } from "@/lib/authentication";

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

        const getMedia = await MediaModel.findOne(filter).lean()
        if(!getMedia) {
            return response(false, 404, 'Media not found')
        }

        return response(true, 200, 'Media fetched successfully', getMedia)
    } catch (error) {
        return catchError(error)
    }
}