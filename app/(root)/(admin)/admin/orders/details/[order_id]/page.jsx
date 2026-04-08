'use client'
import Image from 'next/image'
import React, { use, useEffect, useState } from 'react'
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp"
import Link from 'next/link'
import { WEBSITE_PRODUCT_DETAILS } from '@/routes/WebsiteRoute'
import useFetch from '@/hooks/useFetch'
import { ADMIN_DASHBOARD, ADMIN_ORDERS_SHOW } from '@/routes/AdminPanelRoute'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import Select from '@/components/Application/Select'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { X } from 'lucide-react'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: 'Home' },
  { href: ADMIN_ORDERS_SHOW, label: 'Orders' },
  { href: '', label: 'Order Details' },
]

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'pending_verification', label: 'Pending Verification' },
  { value: 'unverified', label: 'Unverified' },
]

const OrderDetails = ({ params }) => {
  const { order_id } = use(params)
  const [orderData, setOrderData] = useState()
  const [orderStatus, setOrderStatus] = useState()
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const { data, loading } = useFetch(`/api/orders/get/${order_id}`)

  useEffect(() => {
    if (data && data.success) {
      setOrderData(data)
      setOrderStatus(data?.data?.status)
    }
  }, [data])

  const handleOrderStatus = async () => {
    setUpdatingStatus(true)
    try {
      const { data: response } = await axios.put('/api/orders/update-status', {
        _id: orderData?.data?._id,
        status: orderStatus
      })
      if (!response.success) {
        throw new Error(response.message)
      }

      showToast('success', response.message)
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl)
    setShowImageModal(true)
  }

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <div className='border'>
        {orderData && !orderData.success ?
          <div className='flex justify-center items-center py-32 '>
            <h4 className='text-red-500 text-xl font-semibold'>Order not found</h4>
          </div> :
          <div>
            <div className='py-2 px-5 border-b mb-3'>
              <h4 className='text-lg text-primary'>Order Details</h4>
            </div>

            <div className='px-5 mb-5'>
              <div className='mb-5 grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <p>
                    <b>Date:</b> {
                      orderData?.data?.createdAt
                        ? new Date(orderData.data.createdAt).toLocaleDateString('en-PK', {
                          timeZone: 'Asia/Karachi',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })
                        : 'N/A'
                    }
                  </p>
                  <p><b>Transaction ID:</b> {orderData?.data?.transaction_id}</p>
                  <p className='capitalize'><b>Status:</b> {orderData?.data?.status}</p>
                </div>

                {/* Payment Proof Section */}
                {orderData?.data?.proof?.url && (
                  <div className='border rounded-lg p-3 bg-gray-50 dark:bg-card'>
                    <p className='font-semibold mb-2'>Payment Proof:</p>
                    <div
                      className='relative w-32 h-32 cursor-pointer group mx-auto'
                      onClick={() => openImageModal(orderData.data.proof.url)}
                    >
                      <Image
                        src={orderData.data.proof.url}
                        alt="Payment Proof"
                        fill
                        className='object-cover rounded-lg border hover:opacity-90 transition-opacity'
                      />
                      <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center'>
                        <span className='text-white text-xs'>Click to enlarge</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <table className='w-full border'>
                <thead className='border-b bg-gray-50 dark:bg-card md:table-header-group hidden'>
                  <tr>
                    <th className="text-center p-3">Product</th>
                    <th className="text-center p-3">Price</th>
                    <th className="text-center p-3">Quantity</th>
                    <th className="text-center p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData && orderData?.data?.products?.map((product) => (
                    <tr key={product.variantId._id} className='md:table-row block border-b'>
                      <td className='md:table-cell p-3 '>
                        <div className="flex items-center gap-5">
                          <Image src={product?.variantId?.media[0]?.secure_url || imgPlaceholder} alt={product?.productId?.name} width={60} height={60} className="rounded" />
                          <div>
                            <h4 className="text-lg">
                              <Link href={WEBSITE_PRODUCT_DETAILS(product?.productId?.slug)}>{product?.productId?.name}</Link>
                              <p className="">Color: {product?.variantId?.color}</p>
                              <p className="">Size: {product?.variantId?.size}</p>
                            </h4>
                          </div>
                        </div>
                      </td>

                      <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center">
                        <span className="md:hidden font-medium">Price</span>
                        <span>{product?.sellingPrice.toLocaleString('en-PK', { style: 'currency', currency: "PKR" })}</span>
                      </td>

                      <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center">
                        <span className="md:hidden font-medium">Quantity</span>
                        <span>{product?.qty}</span>
                      </td>

                      <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center">
                        <span className="md:hidden font-medium">Total</span>
                        <span>{(product?.qty * product?.sellingPrice).toLocaleString('en-PK', { style: 'currency', currency: "PKR" })}</span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="grid md:grid-cols-2 grid-cols-1 gap-10 border mt-10">
                <div className="p-5">
                  <h4 className='text-lg font-semibold mb-5'>Shipping Address</h4>
                  <div>
                    <table className='w-full'>
                      <tbody>
                        <tr>
                          <td className='font-medium py-2'>Name</td>
                          <td className='text-end py-2'>{orderData?.data?.name}</td>
                        </tr>
                        <tr>
                          <td className='font-medium py-2'>Email</td>
                          <td className='text-end py-2'>{orderData?.data?.email}</td>
                        </tr>
                        <tr>
                          <td className='font-medium py-2'>Phone</td>
                          <td className='text-end py-2'>{orderData?.data?.phone}</td>
                        </tr>
                        <tr>
                          <td className='font-medium py-2'>Country</td>
                          <td className='text-end py-2'>{orderData?.data?.country}</td>
                        </tr>
                        <tr>
                          <td className='font-medium py-2'>State</td>
                          <td className='text-end py-2'>{orderData?.data?.state}</td>
                        </tr>
                        <tr>
                          <td className='font-medium py-2'>City</td>
                          <td className='text-end py-2'>{orderData?.data?.city}</td>
                        </tr>
                        <tr>
                          <td className='font-medium py-2'>Pincode</td>
                          <td className='text-end py-2'>{orderData?.data?.pincode}</td>
                        </tr>
                        <tr>
                          <td className='font-medium py-2'>Landmark</td>
                          <td className='text-end py-2'>{orderData?.data?.landmark}</td>
                        </tr>
                        <tr>
                          <td className='font-medium py-2'>Order Note</td>
                          <td className='text-end py-2'>{orderData?.data?.ordernote || "---"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-5 bg-gray-50 dark:bg-card">
                  <h4 className='text-lg font-semibold mb-5'>Order Summary</h4>
                  <div>
                    <table className='w-full'>
                      <tbody>
                        <tr>
                          <td className='font-medium py-2'>Subtotal</td>
                          <td className='text-end py-2'>{orderData?.data?.subtotal.toLocaleString('en-PK', { style: 'currency', currency: "PKR" })}</td>
                        </tr>
                        <tr>
                          <td className='font-medium py-2'>Discount</td>
                          <td className='text-end py-2'>{orderData?.data?.discount.toLocaleString('en-PK', { style: 'currency', currency: "PKR" })}</td>
                        </tr>
                        <tr>
                          <td className='font-medium py-2'>Coupon Discount</td>
                          <td className='text-end py-2'>{orderData?.data?.couponDiscountAmount.toLocaleString('en-PK', { style: 'currency', currency: "PKR" })}</td>
                        </tr>
                        <tr>
                          <td className='font-medium py-2'>Total</td>
                          <td className='text-end py-2'>{orderData?.data?.totalAmount.toLocaleString('en-PK', { style: 'currency', currency: "PKR" })}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <hr className='my-4' />

                  <div className='pt-3'>
                    <h4 className='text-lg font-semibold mb-2'>Order Status</h4>
                    <Select
                      options={statusOptions}
                      selected={orderStatus}
                      setSelected={(value) => setOrderStatus(value)}
                      placeholder='Select'
                      isMulti={false}
                    />
                    <ButtonLoading loading={updatingStatus} type="button" onClick={handleOrderStatus} className="mt-5" text="Update Status" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className='sm:max-w-[90vw] w-full h-[90vh] p-0 bg-transparent border-0 shadow-none'>
          <DialogTitle className="sr-only">Payment Proof Image</DialogTitle>
          <DialogDescription className="sr-only">
            Full size payment proof image
          </DialogDescription>

          <div className='relative w-full h-full bg-black/90 rounded-lg flex items-center justify-center'>
            <button
              onClick={() => setShowImageModal(false)}
              className='absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors'
            >
              <X className='w-6 h-6 text-white' />
            </button>
            {selectedImage && (
              <div className='relative w-full h-full flex items-center justify-center p-4'>
                <Image
                  src={selectedImage}
                  alt="Payment Proof Full Size"
                  fill
                  className='object-contain'
                  sizes="90vw"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OrderDetails