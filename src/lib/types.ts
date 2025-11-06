import { UUID } from 'crypto'

export type TabId = UUID

export type Tab = {
  id: TabId
  restaurantId: RestaurantId
  createdAt: Date
  closedAt?: Date
  orders: Order[]
}

export type OrderId = `${TabId}.${number}`

export type Order = {
  id: OrderId
  items: OrderItem[]
  sentAt: Date
}

export type TmpOrderItemId = UUID

export type OrderItemId = `${OrderId}.${number}`

export type GuestId = `${number}`

export type CustomerId = UUID

export type OwnerId = GuestId | CustomerId

export type OrderItem = {
  id: OrderItemId
  quantity: number
  ownerIds: OwnerId[]
  menuItemId: MenuItemId
}

export type TmpOrderItem = {
  id: TmpOrderItemId
  quantity: number
  ownerIds: OwnerId[]
  menuItemId: MenuItemId
}

export type RestaurantId = `${number}`

export type Restaurant = {
  id: RestaurantId
  name: string
  photoPathinfo: string
  address: string
}

export type MenuItemId = `${RestaurantId}.${number}`

export type MenuItem = {
  id: MenuItemId
  name: string
  description?: string
  photoPathinfo: string
  price: number
  portionSize: number
  available: boolean
  menuTagIds: MenuTagId[]
  createdAt: Date
}

export type MenuTagId = `${RestaurantId}.${number}`

export type MenuTag = {
  id: MenuTagId
  value: string
  description: string
  dimension: string
  prerequisites: MenuTag[]
  createdAt: Date
  deletedAt?: Date
}
