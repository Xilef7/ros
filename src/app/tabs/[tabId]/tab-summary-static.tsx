import Link from 'next/link'
import Cover from '@/components/cover'
import { Doc, Id } from '@/convex/_generated/dataModel'
import OwnerOrderItemsSent from '@/components/owner-order-items-sent'
import { convertDbToStrOwnerId, CustomerId, OwnerId } from '@/lib/types'
import { auth } from '@clerk/nextjs/server'
import { calculateFee, defaultFee, formatFee, formatPrice } from '@/lib/price'
import OwnerOrderEmptyItems from '@/components/owner-order-items-empty'
import { OwnerName, PossessiveOwnerName } from '@/components/name-server'
import OwnerAvatar from '@/components/user-avatar-server'

export default async function TabSummary({
  tab,
  restaurant,
  menuItems,
}: {
  tab: Doc<'tabs'>
  restaurant: Doc<'restaurants'>
  menuItems: Record<Id<'menuItems'>, Doc<'menuItems'>>
}) {
  const { userId } = await auth()

  let myOwnerId: CustomerId | null = null
  if (userId) {
    myOwnerId = `CustomerId.${userId}`
  }

  let totalPrice = 0
  const orderItemsByOwnerId = new Map<
    OwnerId,
    Doc<'tabs'>['orders'][number]['items']
  >()
  for (const order of tab.orders) {
    for (const orderItem of order.items) {
      totalPrice += orderItem.price * orderItem.quantity
      for (const ownerId of orderItem.ownerIds) {
        const ownerIdStr = convertDbToStrOwnerId(ownerId)
        if (!orderItemsByOwnerId.has(ownerIdStr)) {
          orderItemsByOwnerId.set(ownerIdStr, [])
        }
        orderItemsByOwnerId.get(ownerIdStr)!.push(orderItem)
      }
    }
  }
  totalPrice += calculateFee(totalPrice, defaultFee)
  const formattedFee = formatFee(defaultFee)

  const sortedOrderItemsByOwnerId = orderItemsByOwnerId
    .entries()
    .filter(([ownerId]) => ownerId !== myOwnerId)
    .toArray()
  if (myOwnerId) {
    const myOrderItems = orderItemsByOwnerId.get(myOwnerId) ?? []
    sortedOrderItemsByOwnerId.unshift([myOwnerId, myOrderItems])
  }

  const formatTime = new Intl.DateTimeFormat(navigator.language, {
    timeStyle: 'short',
  }).format

  return (
    <>
      <Link href={`/restaurants/${restaurant._id}`} className="self-stretch">
        <Cover photoPathinfo={restaurant.photoPathinfo} name={restaurant.name}>
          <div className="flex flex-col">
            <span className="text-white text-xl font-semibold">
              {restaurant.name}
            </span>
            <div className="text-gray-300 text-base font-medium">
              {restaurant.address}
            </div>
          </div>
        </Cover>
      </Link>
      <div className="p-2 self-stretch">
        <div className="bg-neutral-50 border border-muted-foreground rounded-lg p-5 my-3">
          <span className="text-xl font-medium">
            Tab Total:{' '}
            <span className="font-semibold text-primary">
              {formatPrice(totalPrice)}
            </span>
            {formattedFee && (
              <span className="font-medium text-muted-foreground text-sm">
                {` (${formattedFee})`}
              </span>
            )}
          </span>

          <p className="text-sm text-gray-500">
            {`${formatTime(tab._creationTime)} - ${formatTime(tab.closedAt!)}`}
          </p>
        </div>

        {orderItemsByOwnerId.size > 0 ? (
          sortedOrderItemsByOwnerId.map(([ownerId, orderItems]) => (
            <OwnerOrderItemsSent
              key={ownerId}
              ownerId={ownerId}
              isMine={false}
              orderItems={orderItems}
              menu={menuItems}
              isTabOpen={false}
              restaurantId={tab.restaurantId}
              renderName={(ownerId) => <OwnerName id={ownerId} />}
              renderPossessiveName={(ownerId) => (
                <PossessiveOwnerName id={ownerId} />
              )}
              renderAvatar={(ownerId) => <OwnerAvatar id={ownerId} />}
            />
          ))
        ) : (
          <OwnerOrderEmptyItems isTabOpen={false} />
        )}
      </div>
    </>
  )
}
