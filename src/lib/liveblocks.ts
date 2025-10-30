import { Liveblocks } from '@liveblocks/node'

export const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_API_KEY!,
})
