import { redirect } from 'next/navigation'
import { preloadedQueryResult } from 'convex/nextjs'
import { TabId } from '@/lib/types'
import { cachedPreloadTab } from '../cache'

export default async function Layout({
  children,
  params,
}: LayoutProps<'/tabs/[tabId]'>) {
  const { tabId } = await params
  const preloadedTab = await cachedPreloadTab(tabId as TabId)
  const tab = preloadedQueryResult(preloadedTab)

  if ('error' in tab) {
    return children
  }

  if (tab.closedAt) {
    redirect(`/tabs/${tabId}`)
  }

  return children
}
