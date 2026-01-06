import { preloadedQueryResult } from 'convex/nextjs'
import DynamicTabSummary from './tab-summary-dynamic'
import StaticTabSummary from './tab-summary-static'
import { TabId } from '@/lib/types'
import { cachedPreloadTab } from './cache'
import { notFound, unauthorized } from 'next/navigation'
import { RedirectToSignIn } from '@clerk/nextjs'

export default async function Page({ params }: PageProps<'/tabs/[tabId]'>) {
  const { tabId } = await params
  const preloadedTab = await cachedPreloadTab(tabId as TabId)
  const tab = preloadedQueryResult(preloadedTab)

  if ('error' in tab) {
    switch (tab.error) {
      case 'TAB_NOT_FOUND':
        notFound()
      case 'NOT_AUTHENTICATED':
        return <RedirectToSignIn />
      case 'NOT_AUTHORIZED':
        unauthorized()
      default:
        throw tab.error
    }
  }

  if (tab.isFullyPaid) {
    return (
      <StaticTabSummary
        tab={tab}
        restaurant={tab.restaurant}
        menuItems={tab.menuItems}
      />
    )
  }

  return <DynamicTabSummary preloadedTab={preloadedTab} />
}
