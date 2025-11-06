import { getMenu } from '@/lib/db/restaurant'
import { getTab } from '@/lib/db/tab'
import { UUID } from 'crypto'
import { notFound, redirect } from 'next/navigation'
import { ReactNode } from 'react'
import { Room } from './Room'
import { MenuProvider } from './Provider'

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ tabId: UUID }>
}) {
  const { tabId } = await params

  const tab = await getTab(tabId)

  if (!tab) {
    notFound()
  }

  if (tab.closedAt) {
    redirect(`/tabs/${tabId}`)
  }

  const menu = await getMenu(tab.restaurantId)
  if (!menu) {
    throw new Error('Menu not found')
  }

  return (
    <Room tabId={tabId}>
      <MenuProvider menu={menu}>{children}</MenuProvider>
    </Room>
  )
}
