'use client'

import { useTransition } from 'react'
import { convertStrToDbOwnerId, LiveOrderItem, OwnerId } from '@/lib/types'
import { ToImmutable } from '@liveblocks/client'
import { SendIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import OwnerOrderItemsCurrent from '@/components/owner-order-items-current'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  useClearOrderItemsMutation,
  useCurrentOrder,
} from '@/lib/hooks/liveblocks'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useCurrentTabId } from '@/lib/hooks/params'
import { useMyOwnerId } from '@/lib/hooks/user'
import { useTabMenu } from '@/lib/hooks/convex'

export default function CurrentOrderPage() {
  const router = useRouter()
  const tabId = useCurrentTabId()
  const currentOrder = useCurrentOrder()

  const { myOwnerId } = useMyOwnerId()

  const [isPending, startTransition] = useTransition()
  const sendOrder = useMutation(api.tabs.sendOrder)
  const clearOrderItems = useClearOrderItemsMutation()

  const menu = useTabMenu()
  if (typeof menu === 'object' && 'error' in menu) {
    throw new Error(menu.error)
  }

  const orderItemsByOwnerId = new Map<OwnerId, ToImmutable<LiveOrderItem>[]>()
  currentOrder.forEach((orderItem) => {
    orderItem.ownerIds.forEach((ownerId) => {
      if (!orderItemsByOwnerId.has(ownerId)) {
        orderItemsByOwnerId.set(ownerId, [])
      }
      orderItemsByOwnerId.get(ownerId)!.push(orderItem)
    })
  })

  const sortedOrderItemsByOwnerId = orderItemsByOwnerId
    .entries()
    .filter(([ownerId]) => ownerId !== myOwnerId)
    .toArray()
  if (myOwnerId) {
    const myOrderItems = orderItemsByOwnerId.get(myOwnerId) ?? []
    sortedOrderItemsByOwnerId.unshift([myOwnerId, myOrderItems])
  }

  return (
    <>
      <main className="self-stretch">
        {sortedOrderItemsByOwnerId.map(([ownerId, orderItems]) => (
          <OwnerOrderItemsCurrent
            key={ownerId}
            ownerId={ownerId}
            isMine={ownerId === myOwnerId}
            orderItems={orderItems}
            tabId={tabId}
            menu={menu}
          />
        ))}
      </main>

      <ButtonGroup className="fixed bottom-0 w-screen z-10 p-2 pb-4">
        <Button
          onClick={() => {
            startTransition(async () => {
              await sendOrder({
                tabId,
                items: currentOrder
                  .values()
                  .map(
                    ({ quantity, ownerIds, customizations, menuItemId }) => ({
                      quantity,
                      ownerIds: ownerIds.map(convertStrToDbOwnerId),
                      customizations: Object.fromEntries(
                        customizations
                          .entries()
                          .map(([group, customization]) => [
                            group,
                            [...customization],
                          ]),
                      ),
                      menuItemId,
                    }),
                  )
                  .toArray(),
              })
              clearOrderItems(currentOrder.keys().toArray())
              router.push(`/tabs/${tabId}`)
            })
          }}
          disabled={currentOrder.size === 0}
          variant="default"
          vibe="friendly"
          className="w-full h-10"
          aria-label="Check Order"
        >
          {isPending ? <Spinner /> : <SendIcon />}
          <span>Send Order</span>
        </Button>
      </ButtonGroup>
    </>
  )
}
