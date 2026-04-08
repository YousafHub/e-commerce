import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import { isAuthenticated } from "@/lib/authentication";
import CategoryModel from "@/models/Category.model";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth) {
            throw new Error('Unauthorized access')
        }
        await connectDB()

        const filter = {
            deletedAt: null
        }

        const getCategory = await CategoryModel.find(filter).sort({ createdAt: -1 }).lean()

        if(!getCategory) {
            return response(false, 404, 'Collection empty')
        }

        return response(true, 200, 'Data found', getCategory)

    } catch (error) {
        return catchError(error)
    }
}