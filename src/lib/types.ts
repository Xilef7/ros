import { Id } from '@/convex/_generated/dataModel'
import { userId } from '@/convex/schema'
import { User } from '@clerk/nextjs/server'
import { LiveList, LiveMap, LiveObject } from '@liveblocks/client'
import { Infer } from 'convex/values'
import { UUID } from 'crypto'

export type TabId = Id<'tabs'>

export type Tab = {
  id: TabId
  restaurantId: RestaurantId
  createdAt: Date
  closedAt?: Date
  orders: Order[]
}

export type OrderId = `${TabId}.${number}` | string

export type Order = {
  id: OrderId
  items: OrderItem[]
  sentAt: Date
}

export type LiveOrderItemId = UUID

export type OrderItemId = `${OrderId}.${number}` | string

export type LocalOrderItemId = UUID

export type GuestId = `GuestId.${string}`

export type CustomerId = `CustomerId.${User['id']}`

export type Customer = {
  id: CustomerId
  name: string
  photoPathinfo: string
}

export type OwnerId = GuestId | CustomerId

export type OrderItem = {
  id: OrderItemId
  quantity: number
  customizations: Map<string, Set<string>>
  ownerIds: OwnerId[]
  menuItemId: MenuItemId
  price: number
}

export type LiveOrderItem = LiveObject<{
  id: LiveOrderItemId
  quantity: number
  customizations: LiveMap<string, LiveList<string>>
  ownerIds: LiveList<OwnerId>
  menuItemId: MenuItemId
}>

export type LocalOrderItem = {
  id: LocalOrderItemId
  quantity: number
  customizations: Record<string, string[]>
  ownerCount: number
  menuItemId: MenuItemId
}

export type RestaurantId = Id<'restaurants'>

export type Restaurant = {
  id: RestaurantId
  name: string
  photoPathinfo: string
  address: string
}

export type MenuItemId = Id<'menuItems'>

export type MenuItem = {
  id: MenuItemId
  name: string
  description?: string
  photoPathinfo?: string
  price: number
  portionSize: number
  customizations: Customization[]
  available: boolean
  menuTagIds: MenuTagId[]
  createdAt: Date
}

export type Customization = {
  name: string
  minRequired: number
  maxAdditional: number
  options: {
    name: string
    price: number
  }[]
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

export type Fee = {
  name: string
  linearValue?: number
  constantValue?: number
  recursiveFees?: Array<Fee>
}

export function convertDbToStrOwnerId({
  kind,
  value,
}: {
  kind: string
  value: string
}): OwnerId {
  switch (kind) {
    case 'CustomerId':
    case 'GuestId':
      return `${kind}.${value}`
    default:
      throw new Error('DB_OWNER_ID_INVALID')
  }
}

export function convertStrToDbOwnerId(ownerId: string): Infer<typeof userId> {
  const [kind, ...values] = ownerId.split('.')
  switch (kind) {
    case 'CustomerId':
    case 'GuestId':
      return {
        kind,
        value: values.join('.'),
      }
    default:
      throw new Error('STR_OWNER_ID_INVALID')
  }
}
