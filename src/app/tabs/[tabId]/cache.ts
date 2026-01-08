import { fetchMutation, preloadQuery } from 'convex/nextjs'
import { cache } from 'react'
import { auth } from '@clerk/nextjs/server'
import { TabId } from '@/lib/types'
import { api } from '@/convex/_generated/api'

export const cachedPreloadTab = cache(async function preloadTab(tabId: TabId) {
  const { getToken } = await auth()
  const convexToken = await getToken({ template: 'convex' })

  const preloadedTab = await preloadQuery(
    api.tabs.get,
    {
      tabId,
    },
    {
      token: convexToken ?? undefined,
    },
  )

  return preloadedTab
})

export const cachedVisitTab = cache(async function visitTab(tabId: TabId) {
  const { isAuthenticated, userId, getToken } = await auth()
  if (!isAuthenticated) {
    return
  }
  const convexToken = await getToken({ template: 'convex' })

  await fetchMutation(
    api.tabs.visit,
    {
      tabId,
      customerId: userId,
    },
    {
      token: convexToken ?? undefined,
    },
  )
})
