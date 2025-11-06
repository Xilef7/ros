import { getRestaurant } from '@/lib/db/restaurant'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { RestaurantId } from '@/lib/types'
import Image from 'next/image'

export default async function Page({
  params,
}: {
  params: Promise<{ restaurantId: RestaurantId }>
}) {
  const { restaurantId } = await params
  const restaurant = await getRestaurant(restaurantId)

  if (!restaurant) {
    notFound()
  }

  return (
    <main className="p-4">
      <Image
        src={restaurant.photoPathinfo}
        alt={restaurant.name}
        width={400}
        height={160}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h1 className="text-2xl font-bold text-orange-700">{restaurant.name}</h1>
      <p className="text-gray-600 mb-4">{restaurant.address}</p>
      <Link
        href={`/restaurants/${restaurant.id}/menu`}
        className="inline-block bg-orange-500 text-white px-4 py-2 rounded shadow hover:bg-orange-600 transition"
      >
        View Menu
      </Link>
    </main>
  )
}
