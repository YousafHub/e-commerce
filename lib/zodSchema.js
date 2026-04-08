import { z } from "zod";

export const zSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(30, { message: "Name must be less than 30 characters" }),

  email: z
    .string()
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(50, { message: "Password must be less than 50 characters" })
    .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Must contain at least one number" })
    .regex(/[@$!%*?&#]/, { message: "Must contain at least one special character" }),

  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^[0-9]+$/, { message: "OTP must contain only numbers" }),

  _id: z
    .string()
    .min(3, '_id is required'),

  alt: z
    .string()
    .min(3, 'Alt text is required'),

  title: z
    .string()
    .min(3, 'Title is required'),

  slug: z
    .string()
    .min(3, 'Slug is required'),

  category: z.string().min(3, 'Category is required'),
  mrp: z.union([
    z.number().positive('Expected positive value, received negative.'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number')
  ]),
  sellingPrice: z.union([
    z.number().positive('Expected positive value, received negative.'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number')
  ]),
  discountPercentage: z.union([
    z.number().positive('Expected positive value, received negative.'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number')
  ]),
  description: z.string().min(3, 'Description is required.'),
  media: z.array(z.string()),
  product: z.string().min(3, "Product is required."),
  userId: z.string().min(3, "User ID is required."),
  sku: z.string().min(3, "SKU is required."),
  color: z.string().min(3, "Color is required."),
  size: z.string().min(1, "Size is required."),
  code: z.string().min(1, "Code is required."),
  amount: z.union([
    z.number().positive('Expected positive value, received negative.'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number')
  ]),
  minShoppingAmount: z.union([
    z.number().positive('Expected positive value, received negative.'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number')
  ]),
  validity: z.coerce.date(),
  rating: z.union([
    z.number().positive('Expected positive value, received negative.'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'Please enter a valid number')
  ]),
  review: z.string().min(3, "Review is required."),
  couponCode: z.string().min(3, "Coupon Code is required."),
  phone: z.string().min(10, "Phone number is required."),
  country: z.string().min(3, "Country is required."),
  state: z.string().min(3, "State is required."),
  city: z.string().min(3, "City is required."),
  pincode: z.string().min(3, "Pincode is required."),
  landmark: z.string().min(3, "Landmark is required."),
  ordernote: z.string().optional(),
  address: z.string().min(3, "Address is required."),
});
