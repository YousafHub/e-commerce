'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { ADMIN_DASHBOARD, ADMIN_TRASH, ADMIN_PRODUCT_VARIANT_SHOW, ADMIN_PRODUCT_VARIANT_EDIT, ADMIN_PRODUCT_VARIANT_ADD } from '@/routes/AdminPanelRoute'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FiPlus } from 'react-icons/fi'
import DatatableWrapper from '@/components/Application/Admin/DatatableWrapper'
import { useCallback, useMemo } from 'react'
import { columnConfig } from '@/lib/helperfunction'
import EditAction from '@/components/Application/Admin/EditAction'
import DeleteAction from '@/components/Application/Admin/DeleteAction'
import { DT_PRODUCT_VARIANT_COLUMN } from '@/lib/column'

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home' },
    { href: ADMIN_PRODUCT_VARIANT_SHOW, label: 'Procuct Variant' },
]
const ShowProductVariant = () => {

  const columns = useMemo(() => {
    return columnConfig(DT_PRODUCT_VARIANT_COLUMN)
  }, [])

  const action = useCallback((row, deleteType, handleDelete) => {
    let actionMenu = []
      actionMenu.push(<EditAction key='edit' href={ADMIN_PRODUCT_VARIANT_EDIT(row.original._id)} /> )
      actionMenu.push(<DeleteAction key='delete' handleDelete={handleDelete} row={row} deleteType={deleteType} /> )
      return actionMenu
  }, [])

    return (
        <div>
            <BreadCrumb breadcrumbData={breadcrumbData} />
            <Card className='py-0 rounded shadow-sm gap-0'>
                <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
                    <div className='flex justify-between items-center'>
                    <h4 className='text-xl font-semibold'>Show Product Variants</h4>
                    <Button>
                        <FiPlus />
                      <Link href={ADMIN_PRODUCT_VARIANT_ADD}>
                      New Variant
                      </Link>
                    </Button>
                    </div>
                </CardHeader>
                <CardContent className="px-0 pt-0">
                    <DatatableWrapper 
                      queryKey="product-variant-data"
                      fetchUrl="/api/product-variant"
                      initialPageSize={10}
                      columnsConfig={columns}
                      exportEndPoint="/api/product-variant/export"
                      deleteEndPoint="/api/product-variant/delete"
                      deleteType="SD"
                      trashView={`${ADMIN_TRASH}?trashof=product-variant`}
                      createAction={action}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default ShowProductVariant