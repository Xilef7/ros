'use client'

import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group'
import { useLocalQuantityMutations } from '@/lib/hooks/local'
import { LiveOrderItemId } from '@/lib/types'
import { MinusIcon, PlusIcon } from 'lucide-react'

export default function PreparedQuantityUpdater({
  orderItemId,
  quantity,
}: {
  orderItemId: LiveOrderItemId
  quantity: number
}) {
  const { incrementQuantity, decrementQuantity } = useLocalQuantityMutations()

  return (
    <ButtonGroup>
      <Button
        aria-label="Decrease quantity"
        onClick={() => decrementQuantity(orderItemId)}
        size="icon-sm"
        vibe="friendly"
      >
        <MinusIcon />
      </Button>
      <ButtonGroupText className="min-w-11 justify-center border-primary">
        {quantity}
      </ButtonGroupText>
      <Button
        aria-label="Increase quantity"
        onClick={() => incrementQuantity(orderItemId)}
        size="icon-sm"
        vibe="friendly"
      >
        <PlusIcon />
      </Button>
    </ButtonGroup>
  )
}
