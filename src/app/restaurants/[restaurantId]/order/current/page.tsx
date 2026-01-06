import PreparedOrderItems from './prepared-order-items'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { notFound } from 'next/navigation'
import { RestaurantId } from '@/lib/types'

export default async function CurrentOrderPage({
  params,
}: PageProps<'/restaurants/[restaurantId]'>) {
  const { restaurantId } = await params
  const restaurant = await fetchQuery(api.restaurants.get, {
    restaurantId: restaurantId as RestaurantId,
  })

  if ('error' in restaurant) {
    switch (restaurant.error) {
      case 'RESTAURANT_NOT_FOUND':
        notFound()
      default:
        throw restaurant.error
    }
  }

  return (
    <main className="self-stretch">
      <PreparedOrderItems
        restaurantId={restaurantId as RestaurantId}
        restaurantName={restaurant.name}
        menu={restaurant.menu}
      />
    </main>
  )
}
