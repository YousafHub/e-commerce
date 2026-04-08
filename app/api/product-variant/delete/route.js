import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import { isAuthenticated } from "@/lib/authentication";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            throw new Error('Unaauthorized access')
        }
        await connectDB()

        const payload = await request.json()
        const ids = payload.ids || []
        const deleteType = payload.deleteType

        if (!Array.isArray(ids) || ids.length === 0) {
            return response(false, 404, 'No product variant selected for deletion')
        }

        const data = await ProductVariantModel.find({ _id: { $in: ids } }).lean()

        if (!data.length) {
            return response(false, 404, 'Data not found')
        }

        if (!['SD', 'RSD'].includes(deleteType)) {
            return response(false, 400, 'Invalid delete type. Delete type must either SD or RSD for this route.')
        }

        if (deleteType === "SD") {
            await ProductVariantModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: new Date().toISOString() } })
        } else {
            await ProductVariantModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: null } })
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
            throw new Error('Unaauthorized access')
        }
        await connectDB()

        const payload = await request.json()
        const ids = payload.ids || []
        const deleteType = payload.deleteType

        if (!Array.isArray(ids) || ids.length === 0) {
            return response(false, 404, 'No media selected for deletion')
        }

        const data = await ProductVariantModel.find({ _id: { $in: ids } }).lean()

        if (!data.length) {
            return response(false, 404, 'Data not found')
        }

        if (deleteType !== "PD") {
            return response(false, 400, 'Invalid delete type. Delete type must be PD for this route.')
        }

        await ProductVariantModel.deleteMany({ _id: { $in: ids } })

        return response(true, 200, 'Product Variant deleted permanently')

    } catch (error) {
        return catchError(error)
    }
}