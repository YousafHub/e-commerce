import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Chip } from "@mui/material"
import dayjs from "dayjs"
import userIcon from '@/public/assets/images/user.png'


export const DT_CATEGORY_COLUMN = [
  {
    header: "Category Name",
    accessorKey: "name"
  },
  {
    header: "Slug",
    accessorKey: "slug"
  },
]

export const DT_PRODUCT_COLUMN = [
  {
    header: "Product Name",
    accessorKey: "name"
  },
  {
    header: "Slug",
    accessorKey: "slug"
  },
  {
    header: "Category",
    accessorKey: "category"
  },
  {
    header: "MRP",
    accessorKey: "mrp"
  },
  {
    header: "Selling Price",
    accessorKey: "sellingPrice"
  },
  {
    header: "Discount Percentage",
    accessorKey: "discountPercentage"
  }
]

export const DT_PRODUCT_VARIANT_COLUMN = [
  {
    header: "Product Name",
    accessorKey: "product"
  },
  {
    header: "Color",
    accessorKey: "color"
  },
  {
    header: "Size",
    accessorKey: "size"
  },
  {
    header: "SKU",
    accessorKey: "sku"
  },
  {
    header: "MRP",
    accessorKey: "mrp"
  },
  {
    header: "Selling Price",
    accessorKey: "sellingPrice"
  },
  {
    header: "Discount Percentage",
    accessorKey: "discountPercentage"
  }
]
export const DT_COUPON_COLUMN = [
  {
    header: "Code",
    accessorKey: "code"
  },
  {
    header: "Discount Percentage",
    accessorKey: "discountPercentage"
  },
  {
    header: "Min. Shopping Amount",
    accessorKey: "minShoppingAmount"
  },
  {
    header: "Validity",
    accessorKey: "validity",
    Cell: ({ renderedCellValue }) => (
      new Date() > new Date(renderedCellValue) ? <Chip color="error" label={dayjs(renderedCellValue).format('DD/MM/YYYY')} /> : <Chip color="success" label={dayjs(renderedCellValue).format('DD/MM/YYYY')} />
    ),
  },
]

export const DT_CUSTOMERS_COLUMN = [
  {
    header: "Avatar",
    accessorKey: "avatar",
    Cell: ({ renderedCellValue }) => (
      <Avatar>
        <AvatarImage src={renderedCellValue?.url || userIcon.src} />
      </Avatar>
    )

  },
  {
    header: "Name",
    accessorKey: "name"
  },
  {
    header: "Email",
    accessorKey: "email"
  },
  {
    header: "Phone",
    accessorKey: "phone"
  },
  {
    header: "Address",
    accessorKey: "address"
  },
  {
    header: "Is Verified",
    accessorKey: "isEmailVerified",
    Cell: ({ renderedCellValue }) => (
      renderedCellValue ? <Chip color="success" label="Verified" /> : <Chip color="error" label="Not Verified" />
    )
  },
]

export const DT_REVIEW_COLUMN = [
  {
    header: "Product",
    accessorKey: "product"
  },
  {
    header: "User",
    accessorKey: "user"
  },
  {
    header: "Title",
    accessorKey: "title"
  },
  {
    header: "Rating",
    accessorKey: "rating"
  },
  {
    header: "Review",
    accessorKey: "review"
  },
]

export const DT_ORDER_COLUMN = [
  {
    header: "Order ID",
    accessorKey: "_id"
  },
  {
    header: "Transaction ID",
    accessorKey: "transaction_id"
  },
  {
    header: "Name",
    accessorKey: "name"
  },
  {
    header: "Email",
    accessorKey: "email"
  },
  {
    header: "Phone",
    accessorKey: "phone"
  },
  {
    header: "Country",
    accessorKey: "country"
  },
  {
    header: "State",
    accessorKey: "state"
  },
  {
    header: "City",
    accessorKey: "city"
  },
  {
    header: "Pincode",
    accessorKey: "pincode"
  },
  {
    header: "Total Item",
    accessorKey: "totalItem",
    Cell: ({ renderedCellValue, row }) => (
      <span>{row?.original?.products?.length || 0}</span>
    )
  },
  {
    header: "Subtotal",
    accessorKey: "subtotal"
  },
  {
    header: "Discount",
    accessorKey: "discount",
    Cell: ({ renderedCellValue }) => (
      <span>{Math.round(renderedCellValue)}</span>
    )
  },
  {
    header: "Coupon Discount",
    accessorKey: "couponDiscount",
    Cell: ({ renderedCellValue }) => (
      <span>{Math.round(renderedCellValue) || 0}</span>
    )
  },
  {
    header: "Total Amount",
    accessorKey: "totalAmount"
  },
  {
    header: "Status",
    accessorKey: "status"
  },

]