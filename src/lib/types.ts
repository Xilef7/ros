import { UUID } from 'crypto'

export type OrderItem = {
  id: string
  quantity: number
  guestOwnerIds: string[]
  customerOwnerIds: UUID[]
  menuItemId: string
}
