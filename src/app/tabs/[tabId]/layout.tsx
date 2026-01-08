import { preloadedQueryResult } from 'convex/nextjs'
import { TabId } from '@/lib/types'
import { cachedPreloadTab, cachedVisitTab } from './cache'
import { Room } from './Room'

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
    return children
  }

  await cachedVisitTab(tabId as TabId)

  return <Room tabId={tabId as TabId}>{children}</Room>
}
