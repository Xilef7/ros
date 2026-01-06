'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { RestaurantId } from '@/lib/types'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function CreateTab() {
  const router = useRouter()
  const [restaurantId, setRestaurantId] = useState('')

  const [isPending, startTransition] = useTransition()
  const createTab = useMutation(api.tabs.create)

  return (
    <div className="flex flex-col items-center gap-4">
      <Input
        type="text"
        placeholder="Enter restaurant ID"
        value={restaurantId}
        onChange={(e) => setRestaurantId(e.target.value)}
        className="w-full max-w-sm border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <Button
        onClick={() =>
          startTransition(async () => {
            const tabId = await createTab({
              restaurantId: restaurantId as RestaurantId,
            })
            router.push(`/tabs/${tabId}/menu`)
          })
        }
        disabled={isPending}
        className="w-full max-w-sm bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 text-center disabled:opacity-50"
      >
        {isPending ? <Spinner /> : 'Create Tab'}
      </Button>
    </div>
  )
}
