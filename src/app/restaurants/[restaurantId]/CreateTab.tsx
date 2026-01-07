'use client'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { api } from '@/convex/_generated/api'
import { RestaurantId } from '@/lib/types'
import { useMutation } from 'convex/react'
import { PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export default function CreateTabButton({
  restaurantId,
}: {
  restaurantId: RestaurantId
}) {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const createTab = useMutation(api.tabs.create)

  return (
    <Button
      size="icon-sm"
      variant="default"
      vibe="friendly"
      onClick={() =>
        startTransition(async () => {
          const tabId = await createTab({
            restaurantId: restaurantId as RestaurantId,
          })
          router.push(`/tabs/${tabId}/menu`)
        })
      }
      disabled={isPending}
    >
      {isPending ? <Spinner /> : <PlusIcon />}
    </Button>
  )
}
