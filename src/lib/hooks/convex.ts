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
    ...Object.entries(tab.customerNames).map(
      ([id, name]): { id: CustomerId; name: string } => ({
        id: `CustomerId.${id}`,
        name,
      }),
    ),
    ...Object.entries(tab.guestNames).map(
      ([id, name]): { id: GuestId; name: string } => ({
        id: `GuestId.${id}`,
        name,
      }),
    ),
  ].sort(({ name: a }, { name: b }) => a.localeCompare(b))
}

export function useOwnerConvexMutations() {
  return {
    addOwner: useMutation(api.tabs.addOwner),
    removeOwner: useMutation(api.tabs.removeOwner),
  }
}
