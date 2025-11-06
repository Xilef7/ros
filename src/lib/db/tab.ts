import { randomUUID } from 'crypto'
import { CustomerId, RestaurantId, Tab, TabId } from '../types'
import * as data from './data'

export async function createTab(restaurantId: RestaurantId) {
  const tab: Tab = {
    id: randomUUID(),
    restaurantId: restaurantId,
    createdAt: new Date(),
    orders: [],
  }
  data.tabs.set(tab.id, tab)
  return tab.id
}

export async function getTab(tabId: TabId) {
  return data.tabs.get(tabId)
}

export async function getVisitedTabs(customerId: CustomerId) {
  return data.visitedTabs.get(customerId)
}
