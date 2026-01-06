'use client'

import PreparedOrderItems from '@/components/prepared-order-items'
import { Doc } from '@/convex/_generated/dataModel'
import { useAllPreparedOrders } from '@/lib/hooks/local'
import { MenuItemId, RestaurantId } from '@/lib/types'

export default function PreparedOrderItemsClient({
  restaurantId,
  restaurantName,
  menu,
}: {
  restaurantId: RestaurantId
  restaurantName: string
  menu: Record<MenuItemId, Doc<'menuItems'>>
}) {
  const preparedOrder = useAllPreparedOrders()

  return (
    <PreparedOrderItems
      orderItems={preparedOrder.values().toArray()}
      restaurantId={restaurantId}
      restaurantName={restaurantName}
      menu={menu}
    />
  )
}
