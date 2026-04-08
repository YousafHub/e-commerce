import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import ReviewModel from "@/models/Review.model";

export async function GET() {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            throw new Error('Unauthorized access')
        }

        await connectDB()

        const latestReview = await ReviewModel.find({ deletedAt: null }).sort({ createdAt: -1 }).populate({
            path: 'product',
            select: 'name media',
            populate: {
                path: 'media',
                select: 'secure_url'
            }
        }).lean()

        return response(true, 200, 'latest review', latestReview)
    } catch (error) {
        return catchError(error)
    }
}