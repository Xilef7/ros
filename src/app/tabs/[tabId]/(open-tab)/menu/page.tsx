'use client'

import { useState, useMemo, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { MenuContext } from '../Provider'
import { MenuItem } from '@/lib/types'
import { useCollaborativeOrdering } from '../liveblocks'
import OrderableMenuItem from './MenuItem'

export default function MenuPage() {
  const router = useRouter()
  const menu = useContext(MenuContext)
  const [searchQuery, setSearchQuery] = useState('')
  const {
    currentOrder,
    incrementQuantity,
    decrementQuantity,
    addNewOrderItem,
    addOwner,
    removeOwner,
  } = useCollaborativeOrdering()

  const orderItemsByMenuItemId = new Map()
  currentOrder.values().forEach((orderItem) => {
    if (!orderItemsByMenuItemId.get(orderItem.menuItemId)) {
      orderItemsByMenuItemId.set(orderItem.menuItemId, [])
    }
    orderItemsByMenuItemId.get(orderItem.menuItemId)!.push(orderItem)
  })

  const sortedFilteredMenu = useMemo(() => {
    if (!menu) return [] as MenuItem[]
    return Array.from(menu.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
  }, [menu, searchQuery])

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen bg-orange-50 pb-24">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-white shadow-sm mb-6 rounded-lg overflow-hidden">
        <div className="relative">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <svg
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      {/* Menu List */}
      <div className="space-y-4">
        {sortedFilteredMenu.map((menuItem) => {
          const orderItems = orderItemsByMenuItemId.get(menuItem.id) ?? []
          return (
            <OrderableMenuItem
              key={menuItem.id}
              menuItem={menuItem}
              orderItems={orderItems}
              handleAddToOrder={() => addNewOrderItem(menuItem.id)}
              handleDecrement={(orderItemId) => decrementQuantity(orderItemId)}
              handleIncrement={(orderItemId) => incrementQuantity(orderItemId)}
              availableUserIds={['1', '2', '3']}
              handleAddOwner={(orderItemId, ownerId) =>
                addOwner(orderItemId, ownerId)
              }
              handleRemoveOwner={(orderItemId, ownerId) =>
                removeOwner(orderItemId, ownerId)
              }
            />
          )
        })}
      </div>

      {/* Floating Order Button */}
      <button
        onClick={() => router.push(`order/current`)}
        className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full shadow-lg transition-colors duration-200 flex items-center gap-2"
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
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        Check Order
        <span className="bg-white text-orange-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
          3
        </span>
      </button>
    </div>
  )
}
