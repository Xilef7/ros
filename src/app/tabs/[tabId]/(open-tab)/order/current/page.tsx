'use client'

import { useContext } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { MenuContext } from '../../Provider'
import { useCollaborativeOrdering } from '../../liveblocks'

export default function CurrentOrderPage() {
  const router = useRouter()
  const { currentOrder, incrementQuantity, decrementQuantity } =
    useCollaborativeOrdering()

  const menu = useContext(MenuContext)
  if (!menu) {
    return 'Menu not found'
  }

  const sortedCurrentOrder = [...currentOrder.values()].sort((a, b) =>
    a.id.localeCompare(b.id),
  )

  const totalPrice = currentOrder.values().reduce((sum, item) => {
    const menuItem = menu.get(item.menuItemId)
    if (menuItem) {
      return sum + menuItem.price * item.quantity
    }
    return sum
  }, 0)

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen bg-orange-50">
      <header className="sticky top-0 z-10 bg-white shadow-sm mb-6 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-orange-500 hover:text-orange-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-orange-600">Current Order</h2>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>
        <div className="mt-2 text-lg font-semibold text-gray-700">
          Total: Rp {totalPrice.toLocaleString('id-ID')}
        </div>
      </header>

      <div className="space-y-4">
        {sortedCurrentOrder ? (
          sortedCurrentOrder.map((item) => {
            const menuItem = menu.get(item.menuItemId)!
            return (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="shrink-0">
                      {menuItem.photoPathinfo && (
                        <Image
                          src={menuItem.photoPathinfo}
                          alt={menuItem.name}
                          width={128}
                          height={128}
                          className="w-full md:w-32 h-32 object-cover rounded-lg"
                        />
                      )}
                    </div>

                    <div className="grow">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {menuItem.name}
                      </h3>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-orange-600 font-medium">
                          Rp{' '}
                          {(menuItem.price * item.quantity).toLocaleString(
                            'id-ID',
                          )}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({menuItem.portionSize})
                        </span>
                      </div>

                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center">
                          <button
                            onClick={() => decrementQuantity(item.id)}
                            disabled={item.quantity <= 0}
                            className={`w-8 h-8 rounded-l-lg flex items-center justify-center transition-colors
                            ${
                              item.quantity <= 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                            }`}
                          >
                            -
                          </button>
                          <input
                            readOnly
                            value={item.quantity}
                            className="w-12 h-8 text-center border-y border-orange-200 bg-white"
                          />
                          <button
                            onClick={() => incrementQuantity(item.id)}
                            className="w-8 h-8 rounded-r-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center bg-orange-100 px-3 py-1 rounded-full">
                          <span className="text-sm text-orange-700">
                            {item.ownerIds.length} owner
                            {item.ownerIds.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            No items in the current order.
          </div>
        )}
      </div>
    </div>
  )
}
