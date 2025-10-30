import { randomInt } from 'crypto'
import { cookies } from 'next/headers'
import { liveblocks } from '@/lib/liveblocks'

export async function POST() {
  const cookieStore = await cookies()

  if (!cookieStore.has('id')) {
    cookieStore.set('id', (randomInt(50) + 1).toString())
  }

  const id = cookieStore.get('id')!.value

  const { status, body } = await liveblocks.identifyUser(id)

  return new Response(body, { status })
}
