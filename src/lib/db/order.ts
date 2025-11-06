// This is a stub implementation. Replace with actual database implementation later.
import { UUID } from 'crypto'
import { Order, OrderItem } from '../types'

export async function sendOrderToKitchen(
  tabId: UUID,
  items: OrderItem[],
): Promise<Order> {
  // Stub implementation
  console.log('Sending order to kitchen:', { tabId, items })

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: `${tabId}.${Math.ceil(Math.random() * 1000)}`,
    items,
    sentAt: new Date(),
  }
}
