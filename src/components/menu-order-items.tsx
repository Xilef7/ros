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
import MenuOrderItem from './menu-order-item'
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { MenuItemId, OwnerId } from '@/lib/types'
import {
  useAddOrderItemMutation,
  useCurrentOrderByMenuItemId,
} from '@/lib/hooks/liveblocks'
import { Doc } from '@/convex/_generated/dataModel'
import CustomizationsConfigurator from './customizations-configurator'
import { useMyOwnerId } from '@/lib/hooks/user'
import OwnerAvatar from './user-avatar-client'
import OwnerStack from './owner-stack'
import UserAvatar from './user-avatar'
import { Avatar, AvatarFallback } from './ui/avatar'

export default function MenuOrderItems({
  menuItem,
}: {
  menuItem: Pick<
    Doc<'menuItems'>,
    '_id' | 'name' | 'description' | 'price' | 'customizations'
  >
}) {
  const { _id: menuItemId, name, description, customizations } = menuItem

  const orderItems = useCurrentOrderByMenuItemId(menuItemId)

  const { myOwnerId } = useMyOwnerId()

  const allOwnerIds = new Set(
    orderItems.flatMap((orderItem) => orderItem.ownerIds),
  )
  const hasOrdered = myOwnerId && allOwnerIds.has(myOwnerId)
  const othersCount = allOwnerIds.size - (hasOrdered ? 1 : 0)

  const handleAddOrderItem = useAddOrderItemMutation()

  const renderAddOrderItemButton = (asTrigger: boolean) => (
    <Button
      onClick={
        asTrigger
          ? undefined
          : () => myOwnerId && handleAddOrderItem(menuItemId, myOwnerId)
      }
      variant="outlineColored"
      vibe="friendly"
      className="min-w-30"
      aria-label="Add to order"
      disabled={!myOwnerId}
    >
      Add to Order
    </Button>
  )

  const orderListRef = useRef<HTMLDivElement>(null)

  const handleAddAnother = (menuItemId: MenuItemId, myUserId: OwnerId) => {
    handleAddOrderItem(menuItemId, myUserId)
    if (orderListRef.current) {
      orderListRef.current.scrollTop = orderListRef.current.scrollHeight
    }
  }

  const renderAddAnotherButton = (asTrigger: boolean) => (
    <Button
      onClick={
        asTrigger
          ? undefined
          : () => myOwnerId && handleAddAnother(menuItem._id, myOwnerId)
      }
      vibe="friendly"
      aria-label="Add to order"
      disabled={!myOwnerId}
    >
      {orderItems.length > 0 ? 'Add another' : 'Add to Order'}
    </Button>
  )

  return (
    <>
      <OwnerStack>
        {hasOrdered && <OwnerAvatar id={myOwnerId} />}
        {othersCount > 0 && (
          <Avatar>
            <AvatarFallback>+{othersCount}</AvatarFallback>
          </Avatar>
        )}
      </OwnerStack>
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
          <CustomizationsConfigurator
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
                <MenuOrderItem
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
              <CustomizationsConfigurator
                menuItem={menuItem}
                trigger={renderAddAnotherButton(true)}
              />
            ) : (
              renderAddAnotherButton(false)
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
