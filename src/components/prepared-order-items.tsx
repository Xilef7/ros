import { Fragment } from 'react'
import { XIcon } from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from './ui/skeleton'
import { LocalOrderItem, RestaurantId } from '@/lib/types'
import { calculateOrderItemPrice, formatPrice } from '@/lib/price'
import { Doc, Id } from '@/convex/_generated/dataModel'
import OrderItemCustomizations from './order-item-customizations'
import MenuItemImage from './menu-item-image'
import PreparedOrderEmptyItems from './prepared-order-items-empty'

export default function PreparedOrderItems({
  orderItems,
  restaurantId,
  restaurantName,
  menu,
}: {
  orderItems: LocalOrderItem[]
  restaurantId: RestaurantId
  restaurantName: string
  menu: Record<Id<'menuItems'>, Doc<'menuItems'>> | undefined
}) {
  const totalPrice = menu
    ? orderItems.reduce(
        (totalPrice, { menuItemId, customizations, quantity, ownerCount }) => {
          const menuItem = menu[menuItemId]
          if (menuItem) {
            totalPrice +=
              (calculateOrderItemPrice(menuItem, customizations) * quantity) /
              ownerCount
          }
          return totalPrice
        },
        0,
      )
    : undefined

  return (
    <ItemGroup className="border border-muted-foreground rounded-md m-2 bg-neutral-50">
      <div className="flex items-center gap-2 m-2 mx-3">
        <span className="flex-1 font-normal align-middle">
          {`${restaurantName}'s order items`}
        </span>
        {totalPrice !== undefined && (
          <span className="font-medium text-base align-middle mx-3">
            Total:{' '}
            <span className="font-semibold text-lg text-primary">
              {formatPrice(totalPrice)}
            </span>
          </span>
        )}
      </div>
      {orderItems.length > 0 ? (
        orderItems.map((orderItem) => {
          const menuItem = menu
            ? (menu[orderItem.menuItemId] ?? {
                _id: orderItem.menuItemId,
                name: 'Unknown Menu Item',
              })
            : undefined

          return (
            <Fragment key={orderItem.id}>
              <ItemSeparator />
              <OrderItem
                key={orderItem.id}
                orderItem={orderItem}
                menuItem={menuItem}
                restaurantId={restaurantId}
              />
            </Fragment>
          )
        })
      ) : (
        <PreparedOrderEmptyItems restaurantId={restaurantId} />
      )}
    </ItemGroup>
  )
}

function OrderItem({
  orderItem: { quantity, customizations, ownerCount },
  menuItem,
  restaurantId,
}: {
  orderItem: LocalOrderItem
  menuItem:
    | Pick<
        Doc<'menuItems'>,
        '_id' | 'name' | 'photoPathinfo' | 'price' | 'customizations'
      >
    | undefined
  restaurantId: RestaurantId
}) {
  const isShared = ownerCount !== 1
  const displayedPrice = menuItem
    ? (calculateOrderItemPrice(menuItem, customizations) * quantity) /
      ownerCount
    : undefined

  return (
    <Item>
      <ItemMedia
        variant={menuItem?.photoPathinfo ? 'image' : 'icon'}
        className="size-24"
      >
        <MenuItemImage
          isTabOpen={false}
          restaurantId={restaurantId}
          menuItem={menuItem}
          width={256}
          height={256}
          size={24}
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-base font-semibold">
          {menuItem ? menuItem.name : <Skeleton className="h-6 w-[100px]" />}{' '}
          <XIcon size={12} /> {quantity}
          {isShared && <Badge>Shared</Badge>}
        </ItemTitle>
        <ItemDescription>
          <OrderItemCustomizations
            customizations={Object.entries(customizations)}
          />
        </ItemDescription>

        <div className="flex flex-row mt-2">
          <div className="flex-1 font-semibold text-sm text-neutral-400">
            {displayedPrice ? (
              formatPrice(displayedPrice)
            ) : (
              <Skeleton className="h-6 w-[100px]" />
            )}
            {isShared && ` / ${ownerCount}`}
          </div>
        </div>
      </ItemContent>
    </Item>
  )
}
