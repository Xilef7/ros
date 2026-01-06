'use client'

import { TabId } from '@/lib/types'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { LogOutIcon } from 'lucide-react'
import { useTransition } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Spinner } from '@/components/ui/spinner'

export default function CloseTabButton({ tabId }: { tabId: TabId }) {
  const [isPending, startTransition] = useTransition()
  const closeTab = useMutation(api.tabs.close)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">
          <LogOutIcon /> Close Tab
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Finalize Your Order?</DialogTitle>
          <DialogDescription>
            Once you proceed to payment, this tab will no longer be able to add
            more items or change item ownerships for split payments.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="default"
            onClick={() => {
              startTransition(async () => {
                await closeTab({ tabId })
              })
            }}
          >
            {isPending ? <Spinner /> : 'Proceed to Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
