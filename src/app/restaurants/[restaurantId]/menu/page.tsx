import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getMenu } from '@/lib/db/restaurant'
import { RestaurantId } from '@/lib/types'

export default async function RestaurantMenuPage({
  params,
}: {
  params: Promise<{ restaurantId: RestaurantId }>
}) {
  const { restaurantId } = await params

  const menu = await getMenu(restaurantId)
  if (!menu) return notFound()

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold text-orange-700 mb-4">Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menu.values().map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative h-48 w-full">
              <Image
                src={item.photoPathinfo}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <span className="text-orange-600 font-bold">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              {item.description && (
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
              )}
              <div className="text-sm text-gray-500">
                Portion: {item.portionSize}g
              </div>
              {!item.available && (
                <div className="mt-2 text-red-500 text-sm">
                  Currently unavailable
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
