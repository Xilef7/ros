'use client'

import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group'
import { useQuantityMutations } from '@/lib/hooks/liveblocks'
import { useMyOwnerId } from '@/lib/hooks/user'
import { LiveOrderItemId } from '@/lib/types'
import { MinusIcon, PlusIcon } from 'lucide-react'

export default function QuantityUpdater({
  orderItemId,
  quantity,
}: {
  orderItemId: LiveOrderItemId
  quantity: number
}) {
  const { myOwnerId } = useMyOwnerId()
  const { incrementQuantity, decrementQuantity } = useQuantityMutations()

  return (
    <ButtonGroup>
      <Button
        aria-label="Decrease quantity"
        onClick={() => myOwnerId && decrementQuantity(orderItemId, myOwnerId)}
        size="icon-sm"
        vibe="friendly"
        disabled={!myOwnerId}
      >
        <MinusIcon />
      </Button>
      <ButtonGroupText className="min-w-11 justify-center border-primary">
        {quantity}
      </ButtonGroupText>
      <Button
        aria-label="Increase quantity"
        onClick={() => myOwnerId && incrementQuantity(orderItemId, myOwnerId)}
        size="icon-sm"
        vibe="friendly"
        disabled={!myOwnerId}
      >
        <PlusIcon />
      </Button>
    </ButtonGroup>
  )
}
