import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperfunction";
import { zSchema } from "@/lib/zodSchema";
import z from "zod";
import OrderModel from "@/models/Order.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import cloudinary from "@/lib/cloudinary";
import { isAuthenticated } from "@/lib/authentication";
import { orderNotification } from "@/email/orderNotification";
import { sendMail } from "@/lib/sendMail";

const productSchema = z.object({
    productId: z.string().length(24, 'Invalid product Id format'),
    variantId: z.string().length(24, 'Invalid variant Id format'),
    name: z.string().min(1, 'Product name is required'),
    qty: z.number().min(1, 'Quantity must be at least 1'),
    mrp: z.number().nonnegative('MRP cannot be negative'),
    sellingPrice: z.number().nonnegative('Selling price cannot be negative'),
});

const orderSchema = zSchema.pick({
    name: true,
    email: true,
    phone: true,
    country: true,
    state: true,
    city: true,
    pincode: true,
    landmark: true,
    ordernote: true,
}).extend({
    userId: z.string().optional(),
    transactionId: z.string().min(3, "Transaction ID is required"),
    subtotal: z.number().nonnegative("Subtotal cannot be negative"),
    discount: z.number().nonnegative("Discount cannot be negative"),
    couponDiscountAmount: z.number().nonnegative("Coupon discount cannot be negative"),
    totalAmount: z.number().nonnegative("Total amount cannot be negative"),
    products: z.array(productSchema).min(1, "At least one product is required"),
});

export async function POST(req) {
    try {
        await connectDB();

        // Auth check
        const auth = await isAuthenticated('user');
        if (!auth.isAuth) throw new Error('Unauthorized access. Please login to place order.');

        const formData = await req.formData();

        // Prepare validation data
        const validationData = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            country: formData.get("country"),
            state: formData.get("state"),
            city: formData.get("city"),
            pincode: formData.get("pincode"),
            landmark: formData.get("landmark"),
            ordernote: formData.get("ordernote") || "",
            userId: auth.userId,
            transactionId: formData.get("transactionId"),
            subtotal: Number(formData.get("subtotal")),
            discount: Number(formData.get("discount")),
            couponDiscountAmount: Number(formData.get("couponDiscountAmount") || 0),
            totalAmount: Number(formData.get("totalAmount")),
            products: JSON.parse(formData.get("products") || "[]"),
        };

        // Validate
        const validate = orderSchema.safeParse(validationData);
        if (!validate.success) throw new Error(validate.error.errors[0].message);

        const validatedData = validate.data;

        // Check duplicate transaction
        const existingOrder = await OrderModel.findOne({ transaction_id: validatedData.transactionId });
        if (existingOrder) throw new Error("Transaction ID already used");

        // Verify products
        const verifiedCartData = await Promise.all(
            validatedData.products.map(async (item) => {
                if (!item.variantId.match(/^[0-9a-fA-F]{24}$/)) throw new Error("Invalid variant ID format");

                const variant = await ProductVariantModel.findById(item.variantId)
                    .populate("product")
                    .lean();

                if (!variant) throw new Error(`Product variant not found`);

                return {
                    productId: variant.product._id,
                    variantId: variant._id,
                    name: variant.product.name,
                    qty: item.qty,
                    mrp: variant.mrp,
                    sellingPrice: variant.sellingPrice,
                };
            })
        );

        // Recalculate totals
        const serverSubtotal = verifiedCartData.reduce((sum, p) => sum + (p.sellingPrice * p.qty), 0);
        const serverDiscount = verifiedCartData.reduce((sum, p) => sum + ((p.mrp - p.sellingPrice) * p.qty), 0);
        const serverTotalAmount = serverSubtotal - validatedData.couponDiscountAmount;

        if (Math.abs(validatedData.subtotal - serverSubtotal) >= 1 ||
            Math.abs(validatedData.discount - serverDiscount) >= 1 ||
            Math.abs(validatedData.totalAmount - serverTotalAmount) >= 1) {
            throw new Error("Cart totals mismatch");
        }

        // Upload proof
        const file = formData.get("file");
        if (!file || file.size === 0) throw new Error("Payment proof is required");

        const fileBuffer = await file.arrayBuffer();
        const base64Image = `data:${file.type};base64,${Buffer.from(fileBuffer).toString('base64')}`;
        const uploadedFile = await cloudinary.uploader.upload(base64Image, {
            upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        });

        // Create order
        const newOrder = await OrderModel.create({
            user: validatedData.userId,
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone,
            country: validatedData.country,
            state: validatedData.state,
            city: validatedData.city,
            pincode: validatedData.pincode,
            landmark: validatedData.landmark,
            ordernote: validatedData.ordernote,
            products: verifiedCartData,
            subtotal: serverSubtotal,
            discount: serverDiscount,
            couponDiscountAmount: validatedData.couponDiscountAmount,
            totalAmount: serverTotalAmount,
            status: "unverified",
            transaction_id: validatedData.transactionId,
            proof: {
                url: uploadedFile.secure_url,
                public_id: uploadedFile.public_id
            },
        });

             try {
            const mailData = {
                _id: newOrder.transaction_id,
                orderDetailsUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order-details/${newOrder._id}`
            }

            await sendMail('Order placed successfully', validatedData.email, orderNotification(mailData))
        } catch (error) {
            console.log(error)
        }

        return response(true, 200, "Order placed successfully! We'll verify your payment soon.", newOrder);

    } catch (error) {
        return catchError(error);
    }
}