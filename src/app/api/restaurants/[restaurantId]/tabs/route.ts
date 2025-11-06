import { liveblocks } from '@/lib/liveblocks'
import { createTab } from '@/lib/db/tab'
import { NextRequest } from 'next/server'

export async function POST(
  _req: NextRequest,
  ctx: RouteContext<'/api/restaurants/[restaurantId]/tabs'>,
) {
  const { restaurantId } = await ctx.params

  const tabId = await createTab(restaurantId as `${number}`)

  await liveblocks.getOrCreateRoom('32142ab8-e66d-4ba4-8ff0-953b940a0d31', {
    defaultAccesses: ['room:write'],
  })

  return new Response(tabId)
}
