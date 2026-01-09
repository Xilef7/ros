import { Fragment, ReactNode } from 'react'
import { XIcon } from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from './ui/skeleton'
import {
  convertDbToStrOwnerId,
  OwnerId,
  RestaurantId,
  TabId,
} from '@/lib/types'
import { formatPrice } from '@/lib/price'
import { Doc, Id } from '@/convex/_generated/dataModel'
import OwnerStack from './owner-stack'
import OrderItemCustomizations from './order-item-customizations'
import MenuItemImage from './menu-item-image'
import { OwnerUpdaterSent } from './owner-updater'
import { OwnerButtonSelfSent } from './owner-button-self'
import OwnerOrderItemsGroup from './owner-order-items-group'

export default function OwnerOrderItemsSent({
  ownerId,
  isMine,
  orderItems,
  menu,
  headerPrefix,
  renderName,
  renderPossessiveName,
  renderAvatar,
  ...openTabIdOrRestaurantId
}: {
  ownerId: OwnerId
  isMine: boolean
  orderItems: Doc<'tabs'>['orders'][number]['items']
  menu: Record<Id<'menuItems'>, Doc<'menuItems'>> | undefined
  headerPrefix?: ReactNode
  renderName: (ownerId: OwnerId) => ReactNode
  renderPossessiveName: (ownerId: OwnerId) => ReactNode
  renderAvatar: (ownerId: OwnerId) => ReactNode
} & (
  | { isTabOpen: true; tabId: TabId; restaurantId?: RestaurantId }
  | { isTabOpen: false; restaurantId: RestaurantId; tabId?: TabId }
)) {
  const totalPrice = orderItems.reduce(
    (totalPrice, { price, quantity, ownerIds }) => {
      return totalPrice + (quantity * price) / ownerIds.length
    },
    0,
  )

  return (
    <OwnerOrderItemsGroup
      ownerId={ownerId}
      isMine={isMine}
      totalPrice={totalPrice}
      headerPrefix={headerPrefix}
      renderName={renderName}
      renderPossessiveName={renderPossessiveName}
      renderAvatar={renderAvatar}
      {...openTabIdOrRestaurantId}
    >
      {orderItems?.map((orderItem) => {
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
              renderAvatar={renderAvatar}
              {...openTabIdOrRestaurantId}
            />
          </Fragment>
        )
      })}
    </OwnerOrderItemsGroup>
  )
}

function OrderItem({
  orderItem: { id: orderItemId, price, quantity, customizations, ownerIds },
  menuItem,
  renderAvatar,
  ...openTabIdOrRestaurantId
}: {
  orderItem: Doc<'tabs'>['orders'][number]['items'][number]
  menuItem: Pick<Doc<'menuItems'>, '_id' | 'name' | 'photoPathinfo'> | undefined
  renderAvatar: (ownerId: OwnerId) => ReactNode
} & (
  | { isTabOpen: true; tabId: TabId; restaurantId?: RestaurantId }
  | { isTabOpen: false; restaurantId: RestaurantId; tabId?: TabId }
)) {
  const isTabOpen = openTabIdOrRestaurantId.isTabOpen
  const isShared = ownerIds.length !== quantity && ownerIds.length !== 1
  const ownerStringIds = ownerIds.map(convertDbToStrOwnerId)
  const displayedPrice = (price * quantity) / (isShared ? 1 : ownerIds.length)

  return (
    <Item>
      <ItemMedia
        variant={menuItem?.photoPathinfo ? 'image' : 'icon'}
        className="size-24"
      >
        <MenuItemImage
          {...openTabIdOrRestaurantId}
          menuItem={menuItem}
          width={256}
          height={256}
          size={24}
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-base font-semibold">
          {menuItem ? menuItem.name : <Skeleton className="h-6 w-[100px]" />}{' '}
          <XIcon size={12} /> {quantity / (isShared ? 1 : ownerIds.length)}
          {isShared && <Badge>Shared</Badge>}
        </ItemTitle>
        <ItemDescription className="line-clamp-none">
          <OrderItemCustomizations
            customizations={Object.entries(customizations)}
          />
        </ItemDescription>
        {isShared && (
          <div className="flex flex-row items-center gap-4">
            <OwnerStack>
              {ownerStringIds.map(renderAvatar)}
              {isTabOpen && (
                <OwnerUpdaterSent
                  orderItemId={orderItemId}
                  ownerIds={ownerStringIds}
                />
              )}
            </OwnerStack>
            {isTabOpen && (
              <OwnerButtonSelfSent
                orderItemId={orderItemId}
                ownerIds={ownerStringIds}
              />
            )}
          </div>
        )}
        <div className="flex flex-row mt-2">
          <div className="flex-1 font-semibold text-sm text-neutral-400">
            {formatPrice(displayedPrice)}
            {isShared && ` / ${ownerIds.length}`}
          </div>
        </div>
      </ItemContent>
    </Item>
  )
}
