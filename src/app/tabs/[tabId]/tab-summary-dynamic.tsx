'use client'

import Link from 'next/link'
import { CircleDollarSignIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Cover from '@/components/cover'
import { Preloaded, useMutation, usePreloadedQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'
import OwnerOrderItemsSent from '@/components/owner-order-items-sent'
import { useState, useTransition } from 'react'
import { Spinner } from '@/components/ui/spinner'
import {
  convertDbToStrOwnerId,
  convertStrToDbOwnerId,
  OwnerId,
} from '@/lib/types'
import { calculateFee, defaultFee, formatFee, formatPrice } from '@/lib/price'
import { useTabMenu } from '@/lib/hooks/convex'
import { Checkbox } from '@/components/ui/checkbox'
import CloseTabButton from './CloseTabButton'
import { ButtonGroup } from '@/components/ui/button-group'
import OwnerOrderEmptyItems from '@/components/owner-order-items-empty'
import { OwnerName, PossessiveOwnerName } from '@/components/name-client'
import OwnerAvatar from '@/components/user-avatar-client'
import { useMyOwnerId } from '@/lib/hooks/user'

export default function TabSummary({
  preloadedTab,
}: {
  preloadedTab: Preloaded<typeof api.tabs.get>
}) {
  const tab = usePreloadedQuery(preloadedTab)
  if ('error' in tab) {
    throw new Error(tab.error)
  }

  const menu = useTabMenu()
  if (typeof menu === 'object' && 'error' in menu) {
    throw new Error(menu.error)
  }

  const { myOwnerId } = useMyOwnerId()

  const [toBePaidOwnerIds, setToBePaidOwnerIds] = useState(
    myOwnerId ? [myOwnerId] : [],
  )
  const handleCheckedChange = (
    checked: boolean | 'indeterminate',
    ownerId: OwnerId,
  ) => {
    if (checked === 'indeterminate') {
      return
    }
    if (checked) {
      setToBePaidOwnerIds([...toBePaidOwnerIds, ownerId])
    } else {
      setToBePaidOwnerIds(toBePaidOwnerIds.filter((id) => id !== ownerId))
    }
  }

  const [isPending, startTransition] = useTransition()
  const payTab = useMutation(api.tabs.pay)

  const { restaurant } = tab
  const paidOwnerIds = tab.paidOwnerIds.map(convertDbToStrOwnerId)

  let subTotalPrice = 0
  const orderItemsByOwnerId = new Map<
    OwnerId,
    Doc<'tabs'>['orders'][number]['items']
  >()
  for (const order of tab.orders) {
    for (const orderItem of order.items) {
      subTotalPrice += orderItem.price * orderItem.quantity
      for (const ownerId of orderItem.ownerIds) {
        const ownerIdStr = convertDbToStrOwnerId(ownerId)
        if (!orderItemsByOwnerId.has(ownerIdStr)) {
          orderItemsByOwnerId.set(ownerIdStr, [])
        }
        orderItemsByOwnerId.get(ownerIdStr)!.push(orderItem)
      }
    }
  }
  const totalPrice = subTotalPrice + calculateFee(subTotalPrice, defaultFee)
  const formattedFee = formatFee(defaultFee)

  const sortedOrderItemsByOwnerId = orderItemsByOwnerId
    .entries()
    .filter(([ownerId]) => ownerId !== myOwnerId)
    .toArray()
  if (myOwnerId) {
    const myOrderItems = orderItemsByOwnerId.get(myOwnerId) ?? []
    sortedOrderItemsByOwnerId.unshift([myOwnerId, myOrderItems])
  }

  let toBePaidPrice = 0
  for (const ownerId of toBePaidOwnerIds) {
    for (const { quantity, price, ownerIds } of orderItemsByOwnerId.get(
      ownerId,
    ) ?? []) {
      toBePaidPrice += (quantity * price) / ownerIds.length
    }
  }
  toBePaidPrice = (toBePaidPrice / subTotalPrice) * totalPrice

  const formatTime = new Intl.DateTimeFormat(navigator.language, {
    timeStyle: 'short',
  }).format

  const cover = (
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
  )

  return (
    <>
      {tab.closedAt ? (
        <Link href={`/restaurants/${restaurant._id}`} className="self-stretch">
          {cover}
        </Link>
      ) : (
        cover
      )}
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

          <div className="text-sm text-gray-500">
            {`${formatTime(tab._creationTime)} - ${
              tab.closedAt ? formatTime(tab.closedAt) : 'now'
            }`}
          </div>

          <div className="flex items-center mt-3">
            {!tab.closedAt && orderItemsByOwnerId.size > 0 && (
              <Button asChild>
                <Link href={`/tabs/${tab._id}/menu`}>Order more</Link>
              </Button>
            )}
            {!tab.closedAt && <CloseTabButton tabId={tab._id} />}
          </div>
        </div>

        {orderItemsByOwnerId.size > 0 ? (
          sortedOrderItemsByOwnerId.map(([ownerId, orderItems]) => (
            <OwnerOrderItemsSent
              key={ownerId}
              ownerId={ownerId}
              isMine={ownerId === myOwnerId}
              orderItems={orderItems}
              menu={menu}
              isTabOpen={!tab.closedAt}
              tabId={tab._id}
              restaurantId={tab.restaurantId}
              headerPrefix={
                <Checkbox
                  checked={
                    paidOwnerIds.includes(ownerId)
                      ? 'indeterminate'
                      : toBePaidOwnerIds.includes(ownerId)
                  }
                  onCheckedChange={(checked) => {
                    handleCheckedChange(checked, ownerId)
                  }}
                  disabled={!tab.closedAt || paidOwnerIds.includes(ownerId)}
                />
              }
              renderName={(ownerId) => <OwnerName key={ownerId} id={ownerId} />}
              renderPossessiveName={(ownerId) => (
                <PossessiveOwnerName key={ownerId} id={ownerId} />
              )}
              renderAvatar={(ownerId) => (
                <OwnerAvatar key={ownerId} id={ownerId} />
              )}
            />
          ))
        ) : (
          <OwnerOrderEmptyItems isTabOpen={!tab.closedAt} tabId={tab._id} />
        )}
      </div>
      {tab.closedAt && (
        <ButtonGroup className="fixed bottom-0 w-full z-10 p-2 pb-4">
          <Button
            onClick={() => {
              startTransition(async () => {
                await payTab({
                  tabId: tab._id,
                  toBePaidOwnerIds: toBePaidOwnerIds.map(convertStrToDbOwnerId),
                })
                setToBePaidOwnerIds([])
              })
            }}
            variant="default"
            vibe="friendly"
            className="w-full h-10"
            aria-label="Pay Tab"
          >
            {isPending ? <Spinner /> : <CircleDollarSignIcon />}
            <span>Pay {`(${formatPrice(toBePaidPrice)})`}</span>
          </Button>
        </ButtonGroup>
      )}
    </>
  )
}
