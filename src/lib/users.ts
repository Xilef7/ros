import 'server-only'
import { cache } from 'react'
import { CustomerId, GuestId, TabId } from './types'
import { clerkClient } from '@clerk/nextjs/server'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'

export const getCustomer = cache(async (id: CustomerId) => {
  const client = await clerkClient()

  const user = await client.users.getUser(id)

  return user
})

export const getGuest = cache(async (id: GuestId) => {
  const [, tabId, guestId] = id.split('.')
  const tab = await fetchQuery(api.tabs.get, { tabId: tabId as TabId })
  if (typeof tab === 'object' && 'error' in tab) {
    throw new Error('TAB_NOT_FOUND')
  }
  const name = tab.guestNames[guestId]
  if (name === undefined) {
    throw new Error('GUEST_NOT_FOUND')
  }

  return {
    name,
  }
})
