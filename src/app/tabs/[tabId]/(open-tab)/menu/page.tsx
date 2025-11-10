'use client'

import { useState, useMemo, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { NotepadText, Search } from 'lucide-react'
import { MenuItem } from '@/lib/types'
import { useSelf } from '@liveblocks/react/suspense'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCollaborativeOrdering } from '../liveblocks'
import { MenuContext } from '../Provider'
import OrderableMenuItem from './menu-item'

export default function MenuPage() {
  const router = useRouter()
  const menu = useContext(MenuContext)
  const [searchQuery, setSearchQuery] = useState('')
  const {
    currentOrder,
    incrementQuantity,
    decrementQuantity,
    addNewOrderItem,
    addableOwnerIds,
    addOwner,
    removeOwner,
  } = useCollaborativeOrdering()
  const me = useSelf()

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
    <div>
      <div>
        <Input
          type="search"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search />
      </div>

      <div>
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
              myId={me.id}
              availableUserIds={addableOwnerIds}
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

      <Button onClick={() => router.push(`order/current`)}>
        <NotepadText />
        Check Order
      </Button>
    </div>
  )
}
