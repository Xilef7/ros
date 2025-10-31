'use client'

import { OrderItem } from '@/lib/types'
import { useStorage, useMutation } from '@liveblocks/react/suspense'
import { useSelf } from '@liveblocks/react'
import { LiveList, LiveObject } from '@liveblocks/client'
import { DeepReadonly } from 'next/dist/shared/lib/deep-readonly'
import { MenuItem, MenuItemId } from '@/lib/db/restaurant'

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

  return (
    <div>
      <header>
        <h2>Collaborative Order</h2>
      </header>

      <ul>
        {currentOrder.map((item, index) => {
          const menuItem = menu.get(item.menuItemId)!
          return (
            <li key={item.id}>
              <OrderItemView
                item={item}
                menuItem={menuItem}
                onDecrement={() => decrementQuantity(index)}
                onIncrement={() => incrementQuantity(index)}
                onAddSelf={() => addSelfAsGuestOwner(index)}
                onRemoveSelf={() => removeSelfAsGuestOwner(index)}
              />
            </li>
          )
        })}
      </ul>

      {currentOrder.length === 0 && <div>No items in the current order.</div>}

      <button onClick={addNewOrderItem}>Add Item</button>
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
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <div style={{ minWidth: 220 }}>
        <div>Guest owners: {item.guestOwnerIds.length}</div>
        <div>{menuItem.name}</div>
        {menuItem.description && <div>{menuItem.description}</div>}
        <div>{menuItem.photoPathinfo}</div>
        <div>{menuItem.price}</div>
        <div>{menuItem.portionSize}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={onDecrement}
          aria-label="decrement"
          disabled={item.quantity <= 0}
        >
          -
        </button>
        <input
          readOnly
          value={item.quantity}
          aria-label="quantity"
          style={{ width: 48, textAlign: 'center' }}
        />
        <button onClick={onIncrement} aria-label="increment">
          +
        </button>
      </div>

      <div>
        <button onClick={hasSelf ? onRemoveSelf : onAddSelf}>
          {hasSelf ? 'Remove me' : 'Add me'}
        </button>
      </div>
    </div>
  )
}
