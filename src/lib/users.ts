import 'server-only'
import { cache } from 'react'
import { convertStrToDbOwnerId, CustomerId, GuestId, TabId } from './types'
import { clerkClient } from '@clerk/nextjs/server'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'

export const getCustomer = cache(async (id: CustomerId) => {
  const client = await clerkClient()
  const { value } = convertStrToDbOwnerId(id)

  const user = await client.users.getUser(value)

  return user
})

export const getGuest = cache(async (id: GuestId) => {
  const { value } = convertStrToDbOwnerId(id)
  const [tabId] = value.split('.')
  const tab = await fetchQuery(api.tabs.get, { tabId: tabId as TabId })
  if (typeof tab === 'object' && 'error' in tab) {
    throw new Error(tab.error)
  }
  const name = tab.guestNames[value]
  if (name === undefined) {
    throw new Error('GUEST_NOT_FOUND')
  }

  return {
    name,
  }
})
