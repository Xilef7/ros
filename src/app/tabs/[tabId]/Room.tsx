'use client'

import { ReactNode } from 'react'
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from '@liveblocks/react/suspense'
import { UUID } from 'crypto'
import { LiveList } from '@liveblocks/client'

export function Room({
  tabId,
  children,
}: {
  tabId: UUID
  children: ReactNode
}) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={tabId}
        initialStorage={{ currentOrder: new LiveList([]) }}
      >
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  )
}
