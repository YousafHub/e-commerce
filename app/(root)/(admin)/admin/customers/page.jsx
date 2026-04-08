'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_DASHBOARD, ADMIN_TRASH, ADMIN_COUPON_EDIT, ADMIN_COUPON_ADD } from '@/routes/AdminPanelRoute'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import DatatableWrapper from '@/components/Application/Admin/DatatableWrapper'
import { useCallback, useMemo } from 'react'
import { columnConfig } from '@/lib/helperfunction'
import DeleteAction from '@/components/Application/Admin/DeleteAction'
import { DT_CUSTOMERS_COLUMN } from '@/lib/column'

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home' },
    { href: "", label: 'Customers' },
]
const ShowCustomers = () => {

  const columns = useMemo(() => {
    return columnConfig(DT_CUSTOMERS_COLUMN)
  }, [])

  const action = useCallback((row, deleteType, handleDelete) => {
    let actionMenu = []
      actionMenu.push(<DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType} /> )
      return actionMenu
  }, [])

    return (
        <div>
            <BreadCrumb breadcrumbData={breadcrumbData} />
            <Card className='py-0 rounded shadow-sm gap-0'>
                <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
                    <div className='flex justify-between items-center'>
                    <h4 className='text-xl font-semibold'>Customers</h4>
                    </div>
                </CardHeader>
                <CardContent className="px-0 pt-0">
                    <DatatableWrapper 
                      queryKey="customers-data"
                      fetchUrl="/api/customers"
                      initialPageSize={10}
                      columnsConfig={columns}
                      exportEndPoint="/api/customers/export"
                      deleteEndPoint="/api/customers/delete"
                      deleteType="SD"
                      trashView={`${ADMIN_TRASH}?trashof=customers`}
                      createAction={action}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default ShowCustomers