import { randomUUID, UUID } from 'crypto'
import { RestaurantId } from './restaurant'

export type TabId = UUID

export type Tab = {
  id: TabId
  restaurantId: RestaurantId
  createdAt: Date
  closedAt?: Date
}

globalThis.data ??= new Map<TabId, Tab>()
const data = globalThis.data

export function createTab(restaurantId: RestaurantId) {
  const tab: Tab = {
    id: randomUUID(),
    restaurantId: restaurantId,
    createdAt: new Date(),
  }
  data.set(tab.id, tab)
  return tab.id
}

export function getTab(tabId: TabId) {
  console.log('Data', data)
  return data.get(tabId)
}
