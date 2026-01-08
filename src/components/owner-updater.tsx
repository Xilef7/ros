'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CircleAlertIcon, PlusIcon } from 'lucide-react'
import OwnerAvatar from './user-avatar-client'
import {
  OwnerId,
  LiveOrderItemId,
  OrderItemId,
  convertStrToDbOwnerId,
} from '@/lib/types'
import {
  useOwnerConvexMutations,
  useVisitingUsers as useVisitingUserIds,
} from '@/lib/hooks/convex'
import { useOwnerLiveblocksMutations } from '@/lib/hooks/liveblocks'
import { Toggle } from '@/components/ui/toggle'
import { Spinner } from './ui/spinner'
import { OwnerName } from './name-client'

export function OwnerUpdaterCurrent({
  orderItemId,
  ownerIds,
}: {
  orderItemId: LiveOrderItemId
  ownerIds: ReadonlyArray<OwnerId>
}) {
  const { addOwner, removeOwner } = useOwnerLiveblocksMutations()

  return (
    <OwnerUpdater
      ownerIds={ownerIds}
      handleAddOwner={(ownerId: OwnerId) => addOwner(orderItemId, ownerId)}
      handleRemoveOwner={(ownerId: OwnerId) =>
        removeOwner(orderItemId, ownerId)
      }
    />
  )
}

export function OwnerUpdaterSent({
  orderItemId,
  ownerIds,
}: {
  orderItemId: OrderItemId
  ownerIds: ReadonlyArray<OwnerId>
}) {
  const { addOwner, removeOwner } = useOwnerConvexMutations()

  return (
    <OwnerUpdater
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

function OwnerUpdater({
  ownerIds,
  handleAddOwner,
  handleRemoveOwner,
}: {
  handleAddOwner: (ownerId: OwnerId) => void
  handleRemoveOwner: (ownerId: OwnerId) => void
  ownerIds: ReadonlyArray<OwnerId>
}) {
  const visitingUserIds = useVisitingUserIds()

  if (visitingUserIds === undefined) {
    return <Spinner />
  }

  if ('error' in visitingUserIds) {
    return <CircleAlertIcon />
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <PlusIcon />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share with</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col max-h-[50vh] overflow-y-auto gap-1 p-2">
          {visitingUserIds.map((userId) => {
            const isOwner = ownerIds.includes(userId)
            return (
              <Toggle
                key={userId}
                pressed={isOwner}
                onPressedChange={(pressed) =>
                  (pressed ? handleAddOwner : handleRemoveOwner)(userId)
                }
                size="lg"
                className="group data-[state=on]:bg-primary data-[state=on]:text-white data-[state=off]:border-primary data-[state=off]:border flex flex-row p-2 pr-4 rounded-full"
              >
                <OwnerAvatar id={userId} />
                <div className="flex-1 text-left">
                  <OwnerName id={userId} />
                </div>
                <div className="group-data-[state=off]:text-primary">
                  {isOwner ? 'Remove' : 'Add'}
                </div>
              </Toggle>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
