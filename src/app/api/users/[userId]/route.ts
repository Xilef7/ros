import { NextRequest } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'

export async function GET(
  request: NextRequest,
  ctx: RouteContext<'/api/users/[userId]'>,
) {
  const { userId } = await ctx.params

  const client = await clerkClient()

  const user = await client.users.getUser(userId)

  return user
}
