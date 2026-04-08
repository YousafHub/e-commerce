import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import { isAuthenticated } from "@/lib/authentication";
import UserModel from "@/models/User.model";

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

        const getCustomers = await UserModel.find(filter).sort({ createdAt: -1 }).lean()

        if(!getCustomers) {
            return response(false, 404, 'Collection empty')
        }

        return response(true, 200, 'Data found', getCustomers)

    } catch (error) {
        return catchError(error)
    }
}