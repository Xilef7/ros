'use client'

import { Button } from '@/components/ui/button'
import { useMyOwnerId } from '@/lib/hooks/user'
import { useOwnerConvexMutations } from '@/lib/hooks/convex'
import { useOwnerLiveblocksMutations } from '@/lib/hooks/liveblocks'
import {
  convertStrToDbOwnerId,
  LiveOrderItemId,
  OrderItemId,
  OwnerId,
} from '@/lib/types'
import { Skeleton } from './ui/skeleton'

export function OwnerButtonSelfCurrent({
  orderItemId,
  ownerIds,
}: {
  orderItemId: LiveOrderItemId
  ownerIds: ReadonlyArray<OwnerId>
}) {
  const { addOwner, removeOwner } = useOwnerLiveblocksMutations()

  return (
    <OwnerButtonSelf
      ownerIds={ownerIds}
      handleAddOwner={(ownerId: OwnerId) => addOwner(orderItemId, ownerId)}
      handleRemoveOwner={(ownerId: OwnerId) =>
        removeOwner(orderItemId, ownerId)
      }
    />
  )
}

export function OwnerButtonSelfSent({
  orderItemId,
  ownerIds,
}: {
  orderItemId: OrderItemId
  ownerIds: ReadonlyArray<OwnerId>
}) {
  const { addOwner, removeOwner } = useOwnerConvexMutations()

  return (
    <OwnerButtonSelf
      ownerIds={ownerIds}
      handleAddOwner={(ownerId: OwnerId) =>
        addOwner({ orderItemId, ownerId: convertStrToDbOwnerId(ownerId) })
      }
      handleRemoveOwner={(ownerId: OwnerId) =>
        removeOwner({ orderItemId, ownerId: convertStrToDbOwnerId(ownerId) })
      }
    />
  )
}

function OwnerButtonSelf({
  ownerIds,
  handleAddOwner,
  handleRemoveOwner,
}: {
  ownerIds: ReadonlyArray<OwnerId>
  handleAddOwner: (ownerId: OwnerId) => void
  handleRemoveOwner: (ownerId: OwnerId) => void
}) {
  const { isLoaded, myOwnerId } = useMyOwnerId()

  if (!isLoaded) {
    return <Skeleton className="h-9 w-28 rounded-full" />
  }

  if (!myOwnerId) {
    return null
  }

  const isCurrentUserOwner = myOwnerId && ownerIds.includes(myOwnerId)

  return (
    <Button
      onClick={() =>
        isCurrentUserOwner
          ? handleRemoveOwner(myOwnerId)
          : handleAddOwner(myOwnerId)
      }
      className="w-28"
      variant="secondary"
      vibe="friendly"
      aria-label={isCurrentUserOwner ? 'Exclude Me' : 'Include Me'}
      disabled={!myOwnerId}
    >
      {isCurrentUserOwner ? 'Exclude Me' : 'Include Me'}
    </Button>
  )
}
