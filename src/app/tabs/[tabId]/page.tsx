import { Suspense } from 'react'
import { getTab } from '@/lib/db/tab'
import { notFound } from 'next/navigation'
import { UUID } from 'crypto'
import { getMenu, getRestaurant } from '@/lib/db/restaurant'
import Link from 'next/link'
import Image from 'next/image'

async function TabSummary({ tabIdPromise }: { tabIdPromise: Promise<UUID> }) {
  const tabId = await tabIdPromise

  const tab = await getTab(tabId)

  if (!tab) {
    notFound()
  }

  const restaurant = await getRestaurant(tab.restaurantId)
  if (!restaurant) {
    throw new Error('Restaurant not found')
  }

  const menu = await getMenu(tab.restaurantId)
  if (!menu) {
    throw new Error('Menu not found')
  }

  const totalPrice = tab.orders.reduce((sum, order) => {
    return (
      sum +
      order.items.reduce((orderSum, item) => {
        const menuItem = menu.get(item.menuItemId)
        return orderSum + (menuItem?.price ?? 0) * item.quantity
      }, 0)
    )
  }, 0)

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price)

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen bg-orange-50">
      {/* Restaurant header: clickable photo + name -> /restaurants/[restaurantId] */}
      <div className="mb-4">
        <Link
          href={`/restaurants/${restaurant.id}`}
          className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm"
        >
          {restaurant.photoPathinfo ? (
            // simple img to avoid requiring next/image config changes
            <Image
              src={restaurant.photoPathinfo}
              alt={restaurant.name ?? 'restaurant'}
              width={100}
              className="w-16 h-16 rounded-md object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
          <div>
            <p className="text-lg font-semibold text-gray-800">
              {restaurant.name}
            </p>
          </div>
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
        <h1 className="text-lg font-semibold text-gray-800">Tab Summary</h1>
        <p className="text-sm text-gray-500">
          {tab.createdAt.toLocaleDateString('id-ID')} -{' '}
          {tab.closedAt?.toLocaleTimeString('id-ID')}
        </p>
        <div className="mt-4">
          <p className="text-2xl font-bold text-orange-600">
            {formatPrice(totalPrice)}
          </p>
          {/* Order more when tab is still open */}
          {!tab.closedAt && (
            <div className="mt-3">
              <Link
                href={`/tabs/${tab.id}/menu`}
                className="inline-block px-4 py-2 bg-orange-600 text-white rounded-lg text-sm"
              >
                Order more
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {tab.orders.map((order, index) => (
          <details
            key={order.id}
            className="group bg-white rounded-xl shadow-sm"
          >
            <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
              <div>
                <h2 className="font-medium">Order #{index + 1}</h2>
                <p className="text-sm text-gray-500">
                  {order.sentAt.toLocaleTimeString('id-ID')}
                </p>
              </div>
              <div className="transition-transform group-open:rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </summary>
            <div className="px-4 pb-4 space-y-2">
              {order.items.map((item) => {
                const menuItem = menu.get(item.menuItemId)
                return (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{menuItem?.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-gray-700">
                      {formatPrice((menuItem?.price ?? 0) * item.quantity)}
                    </p>
                  </div>
                )
              })}
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}

function TabSummarySkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen bg-orange-50">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
          <div className="h-8 bg-gray-200 rounded w-1/2 mt-4" />
        </div>

        {/* Orders list skeleton */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-24" />
                  <div className="h-4 bg-gray-200 rounded w-32" />
                </div>
                <div className="h-6 w-6 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Page({ params }: { params: Promise<{ tabId: UUID }> }) {
  const tabIdPromise = params.then(({ tabId }) => tabId)
  return (
    <Suspense fallback={<TabSummarySkeleton />}>
      <TabSummary tabIdPromise={tabIdPromise} />
    </Suspense>
  )
}
