import { Room } from './Room'
import { CollaborativeApp } from './CollaborativeApp'
import { UUID } from 'crypto'
import { getTab } from '@/lib/db/tab'
import { getMenu } from '@/lib/db/restaurant'

export default async function TabRoom({
  params,
}: {
  params: Promise<{ tabId: UUID }>
}) {
  const { tabId } = await params

  const tab = await getTab(tabId)
  if (!tab) {
    return '404'
  }

  const menu = await getMenu(tab.restaurantId)
  if (!menu) {
    return 'wtf?'
  }

  return (
    <Room tabId={tabId}>
      <CollaborativeApp menu={menu} />
    </Room>
  )
}
