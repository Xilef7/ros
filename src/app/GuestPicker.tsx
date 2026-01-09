'use client'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import OwnerAvatar from '@/components/user-avatar-client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CircleAlertIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { convertDbToStrOwnerId } from '@/lib/types'
import { Spinner } from '@/components/ui/spinner'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useCurrentTabId } from '@/lib/hooks/params'
import { useSelectedLayoutSegment } from 'next/navigation'
import { useMyGuestId } from '@/lib/hooks/user'

export default function GuestPickerWrapper() {
  const segment = useSelectedLayoutSegment()
  if (segment !== 'tabs') {
    return null
  }
  return <GuestPicker />
}

function GuestPicker() {
  const [myGuestIdValue, setMyGuestIdValue] = useMyGuestId()

  if (myGuestIdValue === undefined) {
    return <Spinner className="size-6" />
  }

  return (
    <GuestPickerLoaded
      myGuestIdValue={myGuestIdValue}
      setMyGuestIdValue={setMyGuestIdValue}
    />
  )
}

function GuestPickerLoaded({
  myGuestIdValue,
  setMyGuestIdValue,
}: {
  myGuestIdValue: string | null
  setMyGuestIdValue: (myGuestIdValue: string) => void
}) {
  const tabId = useCurrentTabId()
  const tab = useQuery(api.tabs.get, { tabId })

  const [newGuestName, setNewGuestName] = useState('')
  const addGuest = useMutation(api.tabs.addGuest)

  const [open, setOpen] = useState(!myGuestIdValue)
  const setGuestId = (guestId: string) => {
    setMyGuestIdValue(guestId)
    setOpen(false)
  }

  if (typeof tab === 'object' && 'error' in tab) {
    return <CircleAlertIcon />
  }

  if (!tab) {
    return null
  }

  const isFirstGuest = Object.keys(tab.guestNames).length === 0

  if (tab.closedAt && isFirstGuest) {
    return null
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="flex flex-row items-center">
        {tab && myGuestIdValue && (
          <>
            <OwnerAvatar
              id={convertDbToStrOwnerId({
                kind: 'GuestId',
                value: myGuestIdValue,
              })}
            />
            <span className="font-semibold ml-2">
              Hi, {tab.guestNames[myGuestIdValue]}
            </span>
          </>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[50vh] overflow-hidden flex flex-col items-stretch">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isFirstGuest ? 'You are the first one here!' : 'Who are You?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isFirstGuest
              ? 'Enter your name to start!'
              : 'Choose your name from the list!'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {!tab.closedAt && (
          <Item>
            <ItemContent>
              <Input
                className="rounded-full"
                placeholder="New Guest"
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
              />
            </ItemContent>
            <ItemActions>
              <Button
                onClick={async () => {
                  const newGuestId = await addGuest({
                    tabId,
                    guestName: newGuestName,
                  })
                  setNewGuestName('')
                  setGuestId(newGuestId)
                }}
                disabled={newGuestName === ''}
                vibe="friendly"
                size="icon"
              >
                <PlusIcon />
              </Button>
            </ItemActions>
          </Item>
        )}
        <ItemGroup className="overflow-y-auto flex-1">
          {Object.entries(tab.guestNames)
            .sort(([, a], [, b]) => a.localeCompare(b))
            .map(([guestIdValue, name]) => {
              return (
                <Item
                  key={guestIdValue}
                  onClick={() => setGuestId(guestIdValue)}
                  size="sm"
                  variant={
                    guestIdValue === myGuestIdValue ? 'outline' : 'default'
                  }
                >
                  <ItemMedia>
                    <OwnerAvatar
                      id={convertDbToStrOwnerId({
                        kind: 'GuestId',
                        value: guestIdValue,
                      })}
                    />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{name}</ItemTitle>
                  </ItemContent>
                </Item>
              )
            })}
        </ItemGroup>
      </AlertDialogContent>
    </AlertDialog>
  )
}
