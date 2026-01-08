import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'

export async function GET(
  request: NextRequest,
  ctx: RouteContext<'/api/users/[userId]'>,
) {
  const { userId } = await ctx.params
  const [, customerId] = userId.split('.')

  const client = await clerkClient()
  const user = await client.users.getUser(customerId)

  return NextResponse.json({
    fullName: user.fullName,
    imageUrl: user.imageUrl,
  })
}
