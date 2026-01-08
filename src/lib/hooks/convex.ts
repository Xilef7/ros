import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { convertStrToDbOwnerId, CustomerId, GuestId } from '@/lib/types'
import { useCurrentRestaurantId, useCurrentTabId } from './params'

export function useRestaurantMenu() {
  const restaurantId = useCurrentRestaurantId()
  const tab = useQuery(api.restaurants.listMenuItems, { restaurantId })
  if (!tab || 'error' in tab) {
    return tab
  }

  return tab.menuItems
}

export function useTabMenu() {
  const tabId = useCurrentTabId()
  const tab = useQuery(api.tabs.get, { tabId })
  if (!tab || 'error' in tab) {
    return tab
  }

  return tab.menuItems
}

export function useGuestName(id: GuestId) {
  const tabId = useCurrentTabId()
  const tab = useQuery(api.tabs.get, { tabId })
  if (!tab || 'error' in tab) {
    return tab
  }

  const { value } = convertStrToDbOwnerId(id)
  return tab.guestNames[value]
}

export function useVisitingUsers() {
  const tabId = useCurrentTabId()
  const tab = useQuery(api.tabs.get, { tabId })
  if (!tab || 'error' in tab) {
    return tab
  }

  return [
    ...tab.customerIds.map((id): CustomerId => `CustomerId.${id}`),
    ...Object.keys(tab.guestNames).map((id): GuestId => `GuestId.${id}`),
  ]
}

export function useOwnerConvexMutations() {
  return {
    addOwner: useMutation(api.tabs.addOwner),
    removeOwner: useMutation(api.tabs.removeOwner),
  }
}
