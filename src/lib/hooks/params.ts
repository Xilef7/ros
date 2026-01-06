import { useParams } from 'next/navigation'
import { RestaurantId, TabId } from '@/lib/types'

export function useCurrentTabId() {
  const { tabId } = useParams<{ tabId: TabId }>()
  return tabId
}

export function useCurrentRestaurantId() {
  const { restaurantId } = useParams<{ restaurantId: RestaurantId }>()
  return restaurantId
}
