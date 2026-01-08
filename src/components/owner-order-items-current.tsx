import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { LiveOrderItem, OwnerId, TabId } from '@/lib/types'
import { Fragment } from 'react'
import { ToImmutable } from '@liveblocks/client'
import { Badge } from '@/components/ui/badge'
import OwnerStack, { AdditionalAvatar } from './owner-stack'
import { OwnerUpdaterCurrent } from './owner-updater'
import { OwnerButtonSelfCurrent } from './owner-button-self'
import QuantityUpdater from './quantity-updater'
import OrderItemCustomizations from './order-item-customizations'
import { calculateOrderItemPrice, formatPrice } from '@/lib/price'
import MenuItemImage from './menu-item-image'
import { Doc, Id } from '@/convex/_generated/dataModel'
import OwnerOrderItemsGroup from './owner-order-items-group'
import { Skeleton } from './ui/skeleton'
import { OwnerName, PossessiveOwnerName } from './name-client'
import OwnerAvatar from './user-avatar-client'

export default function OwnerOrderItemsCurrent({
  ownerId,
  isMine,
  orderItems,
  tabId,
  menu,
}: {
  ownerId: OwnerId
  isMine: boolean
  orderItems: ToImmutable<LiveOrderItem>[]
  tabId: TabId
  menu: Record<Id<'menuItems'>, Doc<'menuItems'>> | undefined
}) {
  const totalPrice = menu
    ? orderItems.reduce(
        (totalPrice, { menuItemId, customizations, quantity, ownerIds }) => {
          const menuItem = menu[menuItemId]
          if (menuItem) {
            totalPrice +=
              (calculateOrderItemPrice(
                menuItem,
                Object.fromEntries(customizations),
              ) *
                quantity) /
              ownerIds.length
          }
          return totalPrice
        },
        0,
      )
    : undefined

  return (
    <OwnerOrderItemsGroup
      ownerId={ownerId}
      isMine={isMine}
      totalPrice={totalPrice}
      isTabOpen={true}
      tabId={tabId}
      renderName={(ownerId) => <OwnerName id={ownerId} />}
      renderPossessiveName={(ownerId) => <PossessiveOwnerName id={ownerId} />}
      renderAvatar={(ownerId) => <OwnerAvatar id={ownerId} />}
    >
      {orderItems.map((orderItem) => {
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
              tabId={tabId}
            />
          </Fragment>
        )
      })}
    </OwnerOrderItemsGroup>
  )
}

function OrderItem({
  orderItem: { id: orderItemId, quantity, customizations, ownerIds },
  menuItem,
  tabId,
}: {
  orderItem: ToImmutable<LiveOrderItem>
  menuItem:
    | Pick<
        Doc<'menuItems'>,
        '_id' | 'name' | 'photoPathinfo' | 'price' | 'customizations'
      >
    | undefined
  tabId: TabId
}) {
  const isShared = ownerIds.length !== quantity && ownerIds.length !== 1
  const displayedPrice = menuItem
    ? (calculateOrderItemPrice(
        menuItem,
        Object.fromEntries(customizations.entries()),
      ) *
        quantity) /
      (isShared ? 1 : ownerIds.length)
    : undefined

  return (
    <Item>
      <ItemMedia
        variant={menuItem?.photoPathinfo ? 'image' : 'icon'}
        className="size-24"
      >
        <MenuItemImage
          isTabOpen={true}
          tabId={tabId}
          menuItem={menuItem}
          width={256}
          height={256}
          size={24}
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-base font-semibold">
          {menuItem ? menuItem.name : <Skeleton className="h-5 w-[100px]" />}{' '}
          {isShared && <Badge>Shared</Badge>}
        </ItemTitle>
        <ItemDescription className="line-clamp-none">
          <OrderItemCustomizations
            customizations={customizations.entries().toArray()}
          />
        </ItemDescription>
        {isShared && (
          <div className="flex flex-row">
            <OwnerStack>
              {ownerIds.map((ownerId) => (
                <OwnerAvatar key={ownerId} id={ownerId} />
              ))}
              <AdditionalAvatar>
                <OwnerUpdaterCurrent
                  orderItemId={orderItemId}
                  ownerIds={ownerIds}
                />
              </AdditionalAvatar>
            </OwnerStack>
            <OwnerButtonSelfCurrent
              orderItemId={orderItemId}
              ownerIds={ownerIds}
            />
          </div>
        )}
        <div className="flex flex-row mt-2">
          <div className="flex-1 font-semibold text-sm text-neutral-400">
            {displayedPrice ? (
              formatPrice(displayedPrice)
            ) : (
              <Skeleton className="h-6 w-[100px]" />
            )}
            {isShared && ` / ${ownerIds.length}`}
          </div>
          <ItemActions>
            <QuantityUpdater orderItemId={orderItemId} quantity={quantity} />
          </ItemActions>
        </div>
      </ItemContent>
    </Item>
  )
}
