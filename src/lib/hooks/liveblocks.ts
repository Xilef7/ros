import { useMutation, useStorage } from '@liveblocks/react/suspense'
import { LiveOrderItemId, MenuItemId, OwnerId } from '../types'
import { LiveList, LiveMap, LiveObject, shallow } from '@liveblocks/client'
import { v6 as uuidv6 } from 'uuid'
import { UUID } from 'crypto'

export function useCurrentOrder() {
  return useStorage((root) => root.currentOrder)
}

export function useCurrentOrderByMenuItemId(menuItemId: MenuItemId) {
  return useStorage(
    (root) =>
      root.currentOrder
        .values()
        .filter((orderItem) => orderItem.menuItemId === menuItemId)
        .toArray(),
    shallow,
  )
}

export function useAddOrderItemMutation() {
  return useMutation(
    (
      { storage },
      menuItemId: MenuItemId,
      myUserId: OwnerId,
      customizations?: Record<string, string[]>,
    ) => {
      const currentOrder = storage.get('currentOrder')
      const orderId = uuidv6() as UUID
      currentOrder.set(
        orderId,
        new LiveObject({
          id: orderId,
          quantity: 1,
          customizations: new LiveMap(
            customizations &&
              Object.entries(customizations).map(
                ([group, customization]) =>
                  [group, new LiveList(customization)] as [
                    string,
                    LiveList<string>,
                  ],
              ),
          ),
          ownerIds: new LiveList([myUserId]),
          menuItemId,
        }),
      )
    },
    [],
  )
}

export function useClearOrderItemsMutation() {
  return useMutation(({ storage }, ids: LiveOrderItemId[]) => {
    const currentOrder = storage.get('currentOrder')
    ids.forEach((id) => currentOrder.delete(id))
  }, [])
}

export function useOwnerLiveblocksMutations() {
  return {
    addOwner: useMutation(
      ({ storage }, id: LiveOrderItemId, ownerId: OwnerId) => {
        const orderItem = storage.get('currentOrder').get(id)!
        const ownerIds = orderItem.get('ownerIds')
        const indexOfUserId = ownerIds.indexOf(ownerId)
        const isOwner = indexOfUserId > -1
        if (!isOwner) {
          ownerIds.push(ownerId)
        }
      },
      [],
    ),
    removeOwner: useMutation(
      ({ storage }, id: LiveOrderItemId, ownerId: OwnerId) => {
        const orderItem = storage.get('currentOrder').get(id)!
        const ownerIds = orderItem.get('ownerIds')
        const indexOfUserId = ownerIds.indexOf(ownerId)
        const isOwner = indexOfUserId > -1
        if (isOwner) {
          ownerIds.delete(indexOfUserId)
        }
      },
      [],
    ),
  }
}

export function useQuantityMutations() {
  return {
    incrementQuantity: useMutation(
      ({ storage }, id: LiveOrderItemId, myUserId: OwnerId) => {
        const orderItem = storage.get('currentOrder').get(id)!
        const quantity = orderItem.get('quantity')
        const ownerIds = orderItem.get('ownerIds')
        const isSharing = quantity !== ownerIds.length
        const indexOfUserId = ownerIds.indexOf(myUserId)
        const isOwner = indexOfUserId > -1

        orderItem.set('quantity', quantity + 1)
        if (!isSharing && !isOwner) {
          ownerIds.push(myUserId)
        }
      },
      [],
    ),
    decrementQuantity: useMutation(
      ({ storage }, id: LiveOrderItemId, myUserId: OwnerId) => {
        const currentOrder = storage.get('currentOrder')
        const orderItem = currentOrder.get(id)!
        const quantity = orderItem.get('quantity')
        if (quantity > 1) {
          const ownerIds = orderItem.get('ownerIds')
          const isSharing = quantity !== ownerIds.length
          const indexOfUserId = ownerIds.indexOf(myUserId)
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
    ),
  }
}

export function useCustomizationsMutation() {
  return useMutation(
    (
      { storage },
      id: LiveOrderItemId,
      customizations: Record<string, string[]>,
    ) => {
      const orderItem = storage.get('currentOrder').get(id)!

      orderItem.set(
        'customizations',
        new LiveMap(
          Object.entries(customizations).map(
            ([group, customization]) =>
              [group, new LiveList(customization)] as [
                string,
                LiveList<string>,
              ],
          ),
        ),
      )
    },
    [],
  )
}
