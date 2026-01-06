'use client'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useRef } from 'react'
import { ItemGroup } from '@/components/ui/item'
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { MenuItemId } from '@/lib/types'
import {
  useAddPreparedOrderItemMutation,
  useAllPreparedOrders,
} from '@/lib/hooks/local'
import { Doc } from '@/convex/_generated/dataModel'
import PreparedMenuOrderItem from './prepared-menu-order-item'
import PreparedCustomizationsConfigurator from './prepared-customizations-configurator'

export default function PreparedMenuOrderItems({
  menuItem,
}: {
  menuItem: Pick<
    Doc<'menuItems'>,
    '_id' | 'name' | 'description' | 'price' | 'customizations'
  >
}) {
  const { _id: menuItemId, name, description, customizations } = menuItem

  const orderItems = useAllPreparedOrders()
    .values()
    .filter((orderItem) => orderItem.menuItemId === menuItemId)
    .toArray()

  const handleAddOrderItem = useAddPreparedOrderItemMutation()

  const renderAddOrderItemButton = (asTrigger: boolean) => (
    <Button
      onClick={asTrigger ? undefined : () => handleAddOrderItem(menuItemId)}
      variant="outlineColored"
      vibe="friendly"
      className="min-w-30"
      aria-label="Add to order"
    >
      Add to Order
    </Button>
  )

  const orderListRef = useRef<HTMLDivElement>(null)

  const handleAddAnother = (menuItemId: MenuItemId) => {
    handleAddOrderItem(menuItemId)
    if (orderListRef.current) {
      orderListRef.current.scrollTop = orderListRef.current.scrollHeight
    }
  }

  const renderAddAnotherButton = (asTrigger: boolean) => (
    <Button
      onClick={asTrigger ? undefined : () => handleAddAnother(menuItem._id)}
      vibe="friendly"
      aria-label="Add to order"
    >
      {orderItems.length > 0 ? 'Add another' : 'Add to Order'}
    </Button>
  )

  return (
    <Drawer>
      {orderItems.length > 0 ? (
        <DrawerTrigger asChild>
          <Button
            variant="default"
            vibe="friendly"
            className="min-w-30"
            aria-label="Open order items drawer"
          >
            {orderItems.length} item{orderItems.length > 1 && 's'}
          </Button>
        </DrawerTrigger>
      ) : customizations.length > 0 ? (
        <PreparedCustomizationsConfigurator
          menuItem={menuItem}
          trigger={renderAddOrderItemButton(true)}
        />
      ) : (
        renderAddOrderItemButton(false)
      )}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{name}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>

        {orderItems.length > 0 ? (
          <ItemGroup ref={orderListRef} className="overflow-y-auto">
            {orderItems.map((orderItem) => (
              <PreparedMenuOrderItem
                key={orderItem.id}
                orderItem={orderItem}
                menuItem={menuItem}
              />
            ))}
          </ItemGroup>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No orders yet</EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}

        <DrawerFooter>
          {customizations.length > 0 ? (
            <PreparedCustomizationsConfigurator
              menuItem={menuItem}
              trigger={renderAddAnotherButton(true)}
            />
          ) : (
            renderAddAnotherButton(false)
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
