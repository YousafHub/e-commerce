import { catchError, response } from "@/lib/helperfunction";
import { cookies } from "next/headers";

export async function POST(request) {
    try {
        const cookieStore = await cookies()
        cookieStore.delete('access_token')
        return response(true, 200, 'User logged out successfully.')
    } catch (error) {
        catchError(error)
    }
}