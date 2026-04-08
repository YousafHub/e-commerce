'use client'
import UserPanelLayout from '@/components/Application/Website/UserPanelLayout'
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import useFetch from '@/hooks/useFetch'
import { WEBSITE_ORDER_DETAILS } from '@/routes/WebsiteRoute'
import Link from 'next/link'
import React from 'react'
import { HiOutlineShoppingBag } from 'react-icons/hi2'
import { IoCartOutline } from 'react-icons/io5'
import { useSelector } from 'react-redux'

const breadcrumbData = {
  title: "Dashboard",
  links: [{ label: "Dashboard" }]
}

const MyAccount = () => {
  const { data: DashboardData } = useFetch('/api/dashboard/user')
  const cartStore = useSelector(store => store.cartStore)

  return (
    <div>
      <WebsiteBreadcrumb props={breadcrumbData} />
      <UserPanelLayout>
        <div className='shadow rounded'>
          <div className='p-5 text-xl font-semibold border'>
            Dashboard
          </div>
          <div className='p-5'>
            <div className='grid lg:grid-cols-2 grid-cols-1 gap-10'>
              <div className='flex items-center justify-between gap-5 border rounded p-3'>
                <div>
                  <h4 className='font-semibold text-lg mb-1'>Total Orders</h4>
                  <span className='font-semibold text-gray-500'>{DashboardData?.data?.totalOrder}</span>
                </div>
                <div className='w-16 h-16 bg-primary rounded-full flex justify-center items-center'>
                  <HiOutlineShoppingBag className='text-white' size={25} />
                </div>
              </div>

              <div className='flex items-center justify-between gap-5 border rounded p-3'>
                <div>
                  <h4 className='font-semibold text-lg mb-1'>Items in Cart</h4>
                  <span className='font-semibold text-gray-500'>{cartStore?.count}</span>
                </div>
                <div className='w-16 h-16 bg-primary rounded-full flex justify-center items-center'>
                  <IoCartOutline className='text-white' size={25} />
                </div>
              </div>
            </div>

            <div className='mt-5'>
              <h4 className='text-lg font-semibold mb-3'>Recent Orders</h4>
              <div className='overflow-auto'>
              <table className='w-full'>
                <thead>
                  <tr>
                    <th className='text-start p-2 text-sm border-b text-nowrap text-gray-500'>Sr.No.</th>
                    <th className='text-start p-2 text-sm border-b text-nowrap text-gray-500'>Order ID</th>
                    <th className='text-start p-2 text-sm border-b text-nowrap text-gray-500'>Total Items</th>
                    <th className='text-start p-2 text-sm border-b text-nowrap text-gray-500'>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {DashboardData && DashboardData?.data?.recentOrders?.map((order, i) => (
                    <tr key={order._id}>
                      <td className='text-start text-sm text-gray-500 p-2 font-bold'>{i + 1}</td>
                      <td className='text-start text-sm text-gray-500 p-2'><Link className='underline hover:text-blue-500 underline-offset-2' href={WEBSITE_ORDER_DETAILS(order._id)}>
                        {order._id}
                      </Link></td>
                      <td className='text-start text-sm text-gray-500 p-2'>{order.products.length}</td>
                      <td className='text-start text-sm text-gray-500 p-2'>{order.totalAmount.toLocaleString('en-PK', { style: "currency", currency: "PKR"})}</td>

                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        </div>
      </UserPanelLayout>
    </div>
  )
}

export default MyAccount