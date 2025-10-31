import { liveblocks } from '@/lib/liveblocks'
import { createTab } from '@/lib/db/tab'

export async function POST() {
  const tabId = await createTab('1')

  await liveblocks.getOrCreateRoom(tabId, {
    defaultAccesses: ['room:write'],
  })

  return new Response(tabId)
}
