'use server'

import { OrderItem, TabId } from '@/lib/types'
import { sendOrderToKitchen } from '@/lib/db/order'
import { revalidatePath } from 'next/cache'

export async function sendOrder(tabId: TabId, items: OrderItem[]) {
  try {
    await sendOrderToKitchen(
      // In a real implementation, you'd get the tabId from the path params
      tabId,
      items,
    )

    // Revalidate the current order page
    revalidatePath(`/tabs/${tabId}/order/current`)

    return { success: true }
  } catch (error) {
    console.error('Failed to send order:', error)
    return { success: false, error: 'Failed to send order' }
  }
}
