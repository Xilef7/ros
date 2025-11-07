import { MenuItemId, OwnerId, TmpOrderItemId } from '@/lib/types'
import { LiveList, LiveObject } from '@liveblocks/client'
import { useMutation, useStorage } from '@liveblocks/react/suspense'
import { UUID } from 'crypto'
import { v6 as uuidv6 } from 'uuid'

export function useCollaborativeOrdering() {
  const currentOrder = useStorage((root) => root.currentOrder)

  const incrementQuantity = useMutation(
    ({ storage, self }, id: TmpOrderItemId) => {
      const orderItem = storage.get('currentOrder').get(id)!
      const quantity = orderItem.get('quantity')
      const ownerIds = orderItem.get('ownerIds')
      const isSharing = quantity !== ownerIds.length
      const indexOfUserId = ownerIds.indexOf(self.id)
      const isOwner = indexOfUserId > -1

      orderItem.set('quantity', quantity + 1)
      if (!isSharing && !isOwner) {
        ownerIds.push(self.id)
      }
    },
    [],
  )

  const decrementQuantity = useMutation(
    ({ storage, self }, id: TmpOrderItemId) => {
      const currentOrder = storage.get('currentOrder')
      const orderItem = currentOrder.get(id)!
      const quantity = orderItem.get('quantity')
      if (quantity > 1) {
        const ownerIds = orderItem.get('ownerIds')
        const isSharing = quantity !== ownerIds.length
        const indexOfUserId = ownerIds.indexOf(self.id)
        const isOwner = indexOfUserId > -1

        orderItem.set('quantity', quantity - 1)
        if (!isSharing && isOwner) {
          ownerIds.delete(indexOfUserId)
        }
      } else {
        currentOrder.delete(id)
      }
    },
    [],
  )

  const addOwner = useMutation(
    ({ storage }, id: TmpOrderItemId, ownerId: OwnerId) => {
      const orderItem = storage.get('currentOrder').get(id)!
      const ownerIds = orderItem.get('ownerIds')
      const indexOfUserId = ownerIds.indexOf(ownerId)
      const isOwner = indexOfUserId > -1
      if (!isOwner) {
        ownerIds.push(ownerId)
      }
    },
    [],
  )

  const removeOwner = useMutation(
    ({ storage }, id: TmpOrderItemId, ownerId: OwnerId) => {
      const orderItem = storage.get('currentOrder').get(id)!
      const ownerIds = orderItem.get('ownerIds')
      const indexOfUserId = ownerIds.indexOf(ownerId)
      const isOwner = indexOfUserId > -1
      if (isOwner) {
        ownerIds.delete(indexOfUserId)
      }
    },
    [],
  )

  const addSelfToOwner = useMutation(
    ({ storage, self }, id: TmpOrderItemId) => {
      const orderItem = storage.get('currentOrder').get(id)!
      const ownerIds = orderItem.get('ownerIds')
      const indexOfUserId = ownerIds.indexOf(self.id)
      const isOwner = indexOfUserId > -1
      if (!isOwner) {
        ownerIds.push(self.id)
      }
    },
    [],
  )

  const removeSelfFromOwner = useMutation(
    ({ storage, self }, id: TmpOrderItemId) => {
      const orderItem = storage.get('currentOrder').get(id)!
      const ownerIds = orderItem.get('ownerIds')
      const indexOfUserId = ownerIds.indexOf(self.id)
      const isOwner = indexOfUserId > -1
      if (isOwner) {
        ownerIds.delete(indexOfUserId)
      }
    },
    [],
  )

  const addNewOrderItem = useMutation(
    ({ storage, self }, menuItemId: MenuItemId) => {
      const currentOrder = storage.get('currentOrder')
      const id = uuidv6() as UUID
      currentOrder.set(
        id,
        new LiveObject({
          id,
          quantity: 1,
          ownerIds: new LiveList([self.id]),
          menuItemId,
        }),
      )
    },
    [],
  )

  return {
    currentOrder,
    incrementQuantity,
    decrementQuantity,
    addOwner,
    removeOwner,
    addSelfToOwner,
    removeSelfFromOwner,
    addNewOrderItem,
  }
}
