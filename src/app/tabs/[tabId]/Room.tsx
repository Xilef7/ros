'use client'

import { ReactNode } from 'react'
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from '@liveblocks/react/suspense'
import { LiveMap } from '@liveblocks/client'
import { Spinner } from '@/components/ui/spinner'
import { TabId } from '@/lib/types'

export function Room({
  tabId,
  children,
}: {
  tabId: TabId
  children: ReactNode
}) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={tabId}
        initialStorage={{
          currentOrder: new LiveMap([]),
        }}
      >
        <ClientSideSuspense
          fallback={
            <Spinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-16 text-primary" />
          }
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  )
}
