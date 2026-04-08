'use client'
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import useFetch from '@/hooks/useFetch'
import { zSchema } from '@/lib/zodSchema'
import { WEBSITE_ORDER_DETAILS, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import { addIntoCart, clearCart } from '@/store/reducer/cartReducer'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import { IoCloseCircleSharp } from 'react-icons/io5'
import { FaShippingFast } from 'react-icons/fa'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import loading from '@/public/assets/images/loading.svg'
import ManualPaymentDialog from '@/components/Application/Website/ManualPaymentDialog'

const breadcrumb = {
  title: "Checkout",
  links: [{ label: "Checkout" }]
}

const Checkout = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const cart = useSelector(store => store.cartStore)
  const authStore = useSelector(store => store.authStore)
  const [verifiedCartData, setVerifiedCartData] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [coupon, setCoupon] = useState('')
  const [placingOrder, setPlacingOrder] = useState(false)
  const [open, setOpen] = useState(false)
  const [allFormData, setAllFormData] = useState(null)
  const { data: getVerifiedCartData } = useFetch('/api/cart-verification', "POST", { data: cart.products })
  const [isCouponApplied, setIsCouponApplied] = useState(false)
  const [savingOrder, setSavingOrder] = useState(false)

  useEffect(() => {
    if (getVerifiedCartData && getVerifiedCartData.success) {
      const cartData = getVerifiedCartData.data
      setVerifiedCartData(cartData)
      dispatch(clearCart())

      cartData.forEach(cartItem => {
        dispatch(addIntoCart(cartItem))
      })
    }
  }, [getVerifiedCartData])

  useEffect(() => {
    const cartProduct = cart.products
    const subtotalAmount = cartProduct.reduce((sum, product) => sum + (product.sellingPrice * product.qty), 0)
    const discountAmount = cartProduct.reduce((sum, product) => sum + (product.mrp - product.sellingPrice) * product.qty, 0)

    setSubtotal(subtotalAmount)
    setDiscount(discountAmount)
    setTotalAmount(subtotalAmount)

    couponForm.setValue('minShoppingAmount', subtotalAmount)
  }, [cart])

  // coupon form 
  const couponFormSchema = zSchema.pick({
    couponCode: true,
    minShoppingAmount: true
  })

  const couponForm = useForm({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      couponCode: '',
      minShoppingAmount: subtotal
    }
  })

  const applyCoupon = async (values) => {
    setCouponLoading(true)
    try {
      const { data: response } = await axios.post('/api/coupon/apply', values)
      if (!response.success) {
        throw new Error(response.message)
      }

      const discountPercentage = response.data.discountPercentage
      const currentSubtotal = values.minShoppingAmount || subtotal
      const discountAmount = (currentSubtotal * discountPercentage) / 100
      const newTotal = currentSubtotal - discountAmount

      setCouponDiscountAmount(discountAmount)
      setTotalAmount(newTotal)
      setIsCouponApplied(true)

      showToast('success', response.message)
      setCoupon(couponForm.getValues('couponCode'))
      couponForm.resetField('couponCode', '')
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setCouponLoading(false)
    }
  }

  const removeCoupon = () => {
    setIsCouponApplied(false)
    setCoupon('')
    setCouponDiscountAmount(0)
    setTotalAmount(subtotal)
  }

  // place order form
  const orderFormSchema = zSchema.pick({
    name: true,
    email: true,
    phone: true,
    country: true,
    state: true,
    city: true,
    pincode: true,
    landmark: true,
    ordernote: true,
  })

  const orderForm = useForm({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
      landmark: "",
      ordernote: "",
    }
  })

  const placeOrder = async (formData) => {
    setAllFormData(formData)
    setOpen(true)
  }

  const handleManualPaymentSubmit = async ({ transactionId, file }) => {
    setPlacingOrder(true)
    setSavingOrder(true)
    
    try {
      const formData = new FormData()
      
      // Payment info
      formData.append('transactionId', transactionId)
      if (file) {
        formData.append('file', file)
      }
      
      // Order data from form
      formData.append('name', allFormData.name)
      formData.append('email', allFormData.email)
      formData.append('phone', allFormData.phone)
      formData.append('country', allFormData.country)
      formData.append('state', allFormData.state)
      formData.append('city', allFormData.city)
      formData.append('pincode', allFormData.pincode)
      formData.append('landmark', allFormData.landmark)
      formData.append('ordernote', allFormData.ordernote || '')
      formData.append('userId', authStore?.auth?._id || '')
      
      // Cart data
      formData.append('products', JSON.stringify(verifiedCartData))
      formData.append('subtotal', subtotal.toString())
      formData.append('discount', discount.toString())
      formData.append('couponDiscountAmount', couponDiscountAmount.toString())
      formData.append('totalAmount', totalAmount.toString())
      
      // Send to backend
      const { data: response } = await axios.post('/api/payment/save-order', formData)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      showToast('success', response.message)
      dispatch(clearCart())
      orderForm.reset()
      setOpen(false)
      router.push(WEBSITE_ORDER_DETAILS(response.data._id))
      
    } catch (error) {
      console.error('Order error:', error)
      showToast('error', error.response?.data?.message || error.message || 'Failed to place order')
    } finally {
      setPlacingOrder(false)
      setSavingOrder(false)
    }
  }

  return (
    <div>
      {savingOrder &&
        <div className='h-screen w-screen fixed top-0 left-0 z-50 bg-black/50'>
          <div className='h-screen flex justify-center items-center flex-col bg-white'>
            <Image src={loading.src} height={80} width={80} alt='Loading' />
            <h4 className='font-semibold mt-4'>Placing Your Order...</h4>
          </div>
        </div>
      }
      <WebsiteBreadcrumb props={breadcrumb} />
      {cart.count === 0 ?
        <div className='w-screen h-[500px] flex justify-center items-center py-32'>
          <div className='text-center'>
            <h4 className='text-4xl font-semibold mb-5'>Your cart is empty.</h4>
            <Button type="button" asChild>
              <Link href={WEBSITE_SHOP}>Continue Shopping</Link>
            </Button>
          </div>
        </div> :
        <div className='flex lg:flex-nowrap flex-wrap gap-10 my-20 lg:px-32 px-4'>
          <div className='lg:w-[60%] w-full'>
            <div className='flex font-semibold gap-2 items-center'>
              <FaShippingFast size={25} />
              Shipping Address
            </div>
            <div className='mt-5'>
              <Form {...orderForm}>
                <form className='grid grid-cols-2 gap-5' onSubmit={orderForm.handleSubmit(placeOrder)}>
                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Full Name *" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="email" placeholder="Email Address *" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Phone Number *" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Country *" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="State *" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="City *" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Pin Code *" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='mb-3'>
                    <FormField
                      control={orderForm.control}
                      name="landmark"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Landmark *" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='mb-3 col-span-2'>
                    <FormField
                      control={orderForm.control}
                      name="ordernote"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea placeholder="Enter Order Note" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='mb-3'>
                    <ButtonLoading type="submit" text="Place Order" loading={placingOrder} className="bg-black rounded-full px-5" />
                  </div>
                </form>
              </Form>
            </div>
          </div>
          <div className='lg:w-[40%] w-full'>
            <div className='rounded bg-gray-50 p-5 sticky top-5'>
              <h4 className='text-xl font-semibold mb-5'>Order Summary</h4>
              <div>
                <table className='w-full border'>
                  <tbody>
                    {verifiedCartData && verifiedCartData.map(product => (
                      <tr key={product.variantId}>
                        <td className='p-3'>
                          <div className='flex items-center gap-5'>
                            <Image src={product.media} width={60} height={60} alt={product.name} className='rounded' />
                            <div>
                              <h4 className='font-medium line-clamp-1'>
                                <Link href={WEBSITE_PRODUCT_DETAILS(product.url)}>{product.name}</Link>
                              </h4>
                              <p className='text-sm'>Color: {product.color}</p>
                              <p className='text-sm'>Size: {product.size}</p>
                            </div>
                          </div>
                        </td>
                        <td className='p-3 text-center'>
                          <p className='text-nowrap text-sm'>
                            {product.qty} x {product.sellingPrice.toLocaleString('en-PK', { style: 'currency', currency: "PKR" })}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <table className='w-full mt-3'>
                  <tbody>
                    <tr>
                      <td className='font-medium py-2'>Subtotal</td>
                      <td className='text-end py-2'>{subtotal.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</td>
                    </tr>
                    <tr>
                      <td className='font-medium py-2'>Discount</td>
                      <td className='text-end py-2'>- {discount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</td>
                    </tr>
                    <tr>
                      <td className='font-medium py-2'>Coupon Discount</td>
                      <td className='text-end py-2'>- {couponDiscountAmount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</td>
                    </tr>
                    <tr>
                      <td className='font-medium py-2 text-xl'>Total</td>
                      <td className='text-end py-2'>{totalAmount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}</td>
                    </tr>
                  </tbody>
                </table>

                <div className='mt-2 mb-5'>
                  {!isCouponApplied ?
                    <Form {...couponForm}>
                      <form className='flex justify-between gap-5' onSubmit={couponForm.handleSubmit(applyCoupon)}>
                        <div className='w-[calc(100%-100px)]'>
                          <FormField
                            control={couponForm.control}
                            name="couponCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder="Enter coupon code" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className='w-[100px]'>
                          <ButtonLoading type="submit" text="Apply" className="w-full cursor-pointer" loading={couponLoading} />
                        </div>
                      </form>
                    </Form> :
                    <div className='flex justify-between py-1 px-5 rounded-lg bg-gray-200'>
                      <div>
                        <span className='text-xs'>Coupon: </span>
                        <p className='text-sm font-semibold'>{coupon}</p>
                      </div>
                      <button onClick={removeCoupon} type="button" className='text-red-500 cursor-pointer'>
                        <IoCloseCircleSharp size={25} />
                      </button>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <ManualPaymentDialog 
        open={open} 
        setOpen={setOpen} 
        placingOrder={placingOrder} 
        onSubmit={handleManualPaymentSubmit} 
        amount={totalAmount} 
      />
    </div>
  )
}

export default Checkout