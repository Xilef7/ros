import Link from 'next/link'
import { getAllRestaurants } from '@/lib/db/restaurant'
import Image from 'next/image'

export default async function RestaurantsPage() {
  const restaurants = await getAllRestaurants()

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold text-orange-600 mb-4">
        Browse Restaurants
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {restaurants.map((r) => (
          <Link
            key={r.id}
            href={`/restaurants/${r.id}`}
            className="bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col"
          >
            <Image
              src={r.photoPathinfo}
              alt={r.name}
              width={400}
              height={160}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold text-orange-700">
                  {r.name}
                </h2>
                <p className="text-sm text-gray-500">{r.address}</p>
              </div>
              <span className="mt-2 text-orange-500 font-medium">
                View Details
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
