import { useSyncExternalStore } from 'react'
import { LocalOrderItem, LocalOrderItemId, MenuItemId } from '../types'
import { useCurrentRestaurantId } from './params'
import { UUID } from 'crypto'
import { v6 as uuidv6 } from 'uuid'

export function useAllPreparedOrders() {
  const restaurantId = useCurrentRestaurantId()
  const key = `${restaurantId}:prepared_orders`

  return new Map(
    JSON.parse(
      useSyncExternalStore(
        (onStoreChange) => {
          const listener = (event: StorageEvent) => {
            if (event.storageArea === localStorage && event.key === key) {
              onStoreChange()
            }
          }
          window.addEventListener('storage', listener)
          return () => {
            window.removeEventListener('storage', listener)
          }
        },
        () => localStorage.getItem(key) ?? '[]',
        () => '[]',
      ),
    ) as [LocalOrderItemId, LocalOrderItem][],
  )
}

export function usePreparedOrders(
  selector: (preparedOrders: Map<LocalOrderItemId, LocalOrderItem>) => never,
) {
  const restaurantId = useCurrentRestaurantId()
  const key = `${restaurantId}:prepared_orders`

  return new Map(
    JSON.parse(
      useSyncExternalStore(
        (onStoreChange) => {
          const listener = (event: StorageEvent) => {
            if (event.storageArea === localStorage && event.key === key) {
              onStoreChange()
            }
          }
          window.addEventListener('storage', listener)
          return () => {
            window.removeEventListener('storage', listener)
          }
        },
        () =>
          selector(
            new Map(
              JSON.parse(localStorage.getItem(key) ?? '[]') as [
                LocalOrderItemId,
                LocalOrderItem,
              ][],
            ),
          ),
        () => selector(new Map()),
      ),
    ),
  )
}

export function useAddPreparedOrderItemMutation() {
  const restaurantId = useCurrentRestaurantId()
  const key = `${restaurantId}:prepared_orders`

  return (
    menuItemId: MenuItemId,
    customizations?: Record<string, string[]>,
  ) => {
    const preparedOrders = new Map(
      JSON.parse(localStorage.getItem(key) ?? '[]') as [
        LocalOrderItemId,
        LocalOrderItem,
      ][],
    )

    const id = uuidv6() as UUID

    preparedOrders.set(id, {
      id,
      quantity: 1,
      ownerCount: 1,
      customizations: customizations ?? {},
      menuItemId,
    })
    localStorage.setItem(
      key,
      JSON.stringify(preparedOrders.entries().toArray()),
    )
    window.dispatchEvent(
      new StorageEvent('storage', {
        key,
        storageArea: localStorage,
      }),
    )
  }
}

export function useClearPreparedOrderItemsMutation() {
  const restaurantId = useCurrentRestaurantId()
  const key = `${restaurantId}:prepared_orders`

  return () => {
    localStorage.removeItem(key)
    window.dispatchEvent(
      new StorageEvent('storage', {
        key,
        storageArea: localStorage,
      }),
    )
  }
}

export function useLocalQuantityMutations() {
  const restaurantId = useCurrentRestaurantId()
  const key = `${restaurantId}:prepared_orders`

  return {
    incrementQuantity: (id: LocalOrderItemId) => {
      const preparedOrders = new Map(
        JSON.parse(localStorage.getItem(key) ?? '[]') as [
          LocalOrderItemId,
          LocalOrderItem,
        ][],
      )

      const order = preparedOrders.get(id)
      if (order) {
        order.quantity++

        localStorage.setItem(
          key,
          JSON.stringify(preparedOrders.entries().toArray()),
        )
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            storageArea: localStorage,
          }),
        )
      }
    },
    decrementQuantity: (id: LocalOrderItemId) => {
      const preparedOrders = new Map(
        JSON.parse(localStorage.getItem(key) ?? '[]') as [
          LocalOrderItemId,
          LocalOrderItem,
        ][],
      )

      const order = preparedOrders.get(id)
      if (order) {
        if (order.quantity > 1) {
          order.quantity--
        } else {
          preparedOrders.delete(id)
        }

        localStorage.setItem(
          key,
          JSON.stringify(preparedOrders.entries().toArray()),
        )
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            storageArea: localStorage,
          }),
        )
      }
    },
  }
}

export function useLocalOwnerCountMutations() {
  const restaurantId = useCurrentRestaurantId()
  const key = `${restaurantId}:prepared_orders`

  return {
    incrementOwnerCount: (id: LocalOrderItemId) => {
      const preparedOrders = new Map(
        JSON.parse(localStorage.getItem(key) ?? '[]') as [
          LocalOrderItemId,
          LocalOrderItem,
        ][],
      )

      const order = preparedOrders.get(id)
      if (order) {
        order.ownerCount++

        localStorage.setItem(
          key,
          JSON.stringify(preparedOrders.entries().toArray()),
        )
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            storageArea: localStorage,
          }),
        )
      }
    },
    decrementOwnerCount: (id: LocalOrderItemId) => {
      const preparedOrders = new Map(
        JSON.parse(localStorage.getItem(key) ?? '[]') as [
          LocalOrderItemId,
          LocalOrderItem,
        ][],
      )

      const order = preparedOrders.get(id)
      if (order && order.ownerCount > 1) {
        order.ownerCount--

        localStorage.setItem(
          key,
          JSON.stringify(preparedOrders.entries().toArray()),
        )
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            storageArea: localStorage,
          }),
        )
      }
    },
  }
}

export function useLocalCustomizationsMutation() {
  const restaurantId = useCurrentRestaurantId()
  const key = `${restaurantId}:prepared_orders`
  return (
    id: LocalOrderItemId,
    customizations: Readonly<Record<string, ReadonlyArray<string>>>,
  ) => {
    const preparedOrders = new Map(
      JSON.parse(localStorage.getItem(key) ?? '[]') as [
        LocalOrderItemId,
        LocalOrderItem,
      ][],
    )

    const order = preparedOrders.get(id)
    if (order) {
      order.customizations = Object.fromEntries(
        Object.entries(customizations).map(([group, customization]) => [
          group,
          [...customization],
        ]),
      )
    }

    localStorage.setItem(
      key,
      JSON.stringify(preparedOrders.entries().toArray()),
    )
    window.dispatchEvent(
      new StorageEvent('storage', {
        key,
        storageArea: localStorage,
      }),
    )
  }
}
