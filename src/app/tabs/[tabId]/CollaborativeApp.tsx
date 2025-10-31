'use client'

import { OrderItem } from '@/lib/types'
import { useStorage, useMutation } from '@liveblocks/react/suspense'
import { useSelf } from '@liveblocks/react'
import { LiveList, LiveObject } from '@liveblocks/client'
import { DeepReadonly } from 'next/dist/shared/lib/deep-readonly'
import { MenuItem, MenuItemId } from '@/lib/db/restaurant'
import Image from 'next/image'

export function CollaborativeApp({
  menu,
}: {
  menu: Map<MenuItemId, MenuItem>
}) {
  const currentOrder = useStorage((root) => root.currentOrder)

  const me = useSelf()

  const userId = me?.id

  const incrementQuantity = useMutation(
    ({ storage }, index: number) => {
      const orderItem = storage.get('currentOrder').get(index)!
      const guestOwnerIds = orderItem.get('guestOwnerIds')
      const quantity = orderItem.get('quantity')
      const indexOfUserId = guestOwnerIds.indexOf(userId!)
      const isOwner = indexOfUserId > -1
      if (!isOwner && quantity === guestOwnerIds.length) {
        guestOwnerIds.push(userId!)
      }
      orderItem.set('quantity', quantity + 1)
    },
    [userId],
  )

  const decrementQuantity = useMutation(
    ({ storage }, index: number) => {
      const orderItem = storage.get('currentOrder').get(index)!
      const guestOwnerIds = orderItem.get('guestOwnerIds')
      const quantity = orderItem.get('quantity')
      const indexOfUserId = guestOwnerIds.indexOf(userId!)
      const isOwner = indexOfUserId > -1
      if (isOwner && quantity === guestOwnerIds.length) {
        guestOwnerIds.delete(indexOfUserId)
      }
      orderItem.set('quantity', quantity - 1)
    },
    [userId],
  )

  const addSelfAsGuestOwner = useMutation(
    ({ storage }, index: number) => {
      const orderItem = storage.get('currentOrder').get(index)!
      const guestOwnerIds = orderItem.get('guestOwnerIds')
      const indexOfUserId = guestOwnerIds.indexOf(userId!)
      const isOwner = indexOfUserId > -1
      if (!isOwner) {
        guestOwnerIds.push(userId!)
      }
    },
    [userId],
  )

  const removeSelfAsGuestOwner = useMutation(
    ({ storage }, index: number) => {
      const orderItem = storage.get('currentOrder').get(index)!
      const guestOwnerIds = orderItem.get('guestOwnerIds')
      const indexOfUserId = guestOwnerIds.indexOf(userId!)
      const isOwner = indexOfUserId > -1
      if (isOwner) {
        guestOwnerIds.delete(indexOfUserId)
        const quantity = orderItem.get('quantity')
        if (quantity > guestOwnerIds.length) {
          orderItem.set('quantity', quantity - 1)
        }
      }
    },
    [userId],
  )

  const addNewOrderItem = useMutation(
    ({ storage }) => {
      const currentOrder = storage.get('currentOrder')
      currentOrder.push(
        new LiveObject({
          id: Math.random().toString(),
          quantity: 1,
          guestOwnerIds: new LiveList([userId!]),
          customerOwnerIds: new LiveList([]),
          menuItemId: '1-1',
        }),
      )
    },
    [userId],
  )

  const calculateTotal = () => {
    return currentOrder.reduce((total, item) => {
      const menuItem = menu.get(item.menuItemId)!
      return total + menuItem.price * item.quantity
    }, 0)
  }

  // Sort menu items by createdAt
  const sortedMenu = Array.from(menu.values()).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  )

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen bg-orange-50">
      <header className="sticky top-0 z-10 bg-white shadow-sm mb-6 p-4 rounded-lg">
        <h2 className="text-2xl font-bold text-orange-600">
          Collaborative Order
        </h2>
        <div className="mt-2 text-lg font-semibold text-gray-700">
          Total: Rp {calculateTotal().toLocaleString('id-ID')}
        </div>
      </header>

      <div className="space-y-4">
        {currentOrder.map((item, index) => {
          const menuItem = menu.get(item.menuItemId)!
          return (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <OrderItemView
                item={item}
                menuItem={menuItem}
                onDecrement={() => decrementQuantity(index)}
                onIncrement={() => incrementQuantity(index)}
                onAddSelf={() => addSelfAsGuestOwner(index)}
                onRemoveSelf={() => removeSelfAsGuestOwner(index)}
              />
            </div>
          )
        })}
      </div>

      {currentOrder.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No items in the current order.
        </div>
      )}

      <button
        onClick={addNewOrderItem}
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-lg transition-colors duration-200"
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
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </button>
    </div>
  )
}

function OrderItemView({
  item,
  menuItem,
  onDecrement,
  onIncrement,
  onAddSelf,
  onRemoveSelf,
}: {
  item: DeepReadonly<OrderItem>
  menuItem: MenuItem
  onDecrement: () => void
  onIncrement: () => void
  onAddSelf: () => void
  onRemoveSelf: () => void
}) {
  const me = useSelf()
  const hasSelf = item.guestOwnerIds.indexOf(me?.id ?? '') > -1

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Image and basic info */}
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

        {/* Item details */}
        <div className="grow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {menuItem.name}
              </h3>
              {menuItem.description && (
                <p className="text-gray-600 text-sm mt-1">
                  {menuItem.description}
                </p>
              )}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-orange-600 font-medium">
                  Rp {menuItem.price.toLocaleString('id-ID')}
                </span>
                <span className="text-sm text-gray-500">
                  ({menuItem.portionSize})
                </span>
              </div>
            </div>
          </div>

          {/* Guest count and controls */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center bg-orange-100 px-3 py-1 rounded-full">
              <span className="text-sm text-orange-700">
                {item.guestOwnerIds.length} guest
                {item.guestOwnerIds.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex items-center">
              <button
                onClick={onDecrement}
                aria-label="decrement"
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
                aria-label="quantity"
                className="w-12 h-8 text-center border-y border-orange-200 bg-white"
              />
              <button
                onClick={onIncrement}
                aria-label="increment"
                className="w-8 h-8 rounded-r-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors flex items-center justify-center"
              >
                +
              </button>
            </div>

            <button
              onClick={hasSelf ? onRemoveSelf : onAddSelf}
              className={`px-4 py-1 rounded-full text-sm transition-colors ${
                hasSelf
                  ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              {hasSelf ? 'Remove me' : 'Add me'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
