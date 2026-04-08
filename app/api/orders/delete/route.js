import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import { isAuthenticated } from "@/lib/authentication";
import OrderModel from "@/models/Order.model";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            throw new Error('Unauthorized access')
        }
        await connectDB()

        const payload = await request.json()
        const ids = payload.ids || []
        const deleteType = payload.deleteType

        if (!Array.isArray(ids) || ids.length === 0) {
            return response(false, 404, 'No order selected for deletion')
        }

        const data = await OrderModel.find({ _id: { $in: ids } }).lean()

        if (!data.length) {
            return response(false, 404, 'Data not found')
        }

        if (!['SD', 'RSD'].includes(deleteType)) {
            return response(false, 400, 'Invalid delete type. Delete type must either SD or RSD for this route.')
        }

        if (deleteType === "SD") {
            await OrderModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: new Date().toISOString() } })
        } else {
            await OrderModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: null } })
        }

        return response(true, 200, deleteType === "SD" ? "Data moved to Trash" : "Data restored successfully")

    } catch (error) {
        return catchError(error)
    }
}


export async function DELETE(request) {

    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            throw new Error('Unauthorized access')
        }
        await connectDB()

        const payload = await request.json()
        const ids = payload.ids || []
        const deleteType = payload.deleteType

        if (!Array.isArray(ids) || ids.length === 0) {
            return response(false, 404, 'No order selected for deletion')
        }

        const data = await OrderModel.find({ _id: { $in: ids } }).lean()

        if (!data.length) {
            return response(false, 404, 'Data not found')
        }

        if (deleteType !== "PD") {
            return response(false, 400, 'Invalid delete type. Delete type must be PD for this route.')
        }

        await OrderModel.deleteMany({ _id: { $in: ids } })

        return response(true, 200, 'Order deleted permanently')

    } catch (error) {
        return catchError(error)
    }
}