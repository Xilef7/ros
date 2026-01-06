import { Doc } from '@/convex/_generated/dataModel'
import { Fee } from './types'

export function calculateOrderItemPrice(
  menuItem: Pick<Doc<'menuItems'>, 'price' | 'customizations'>,
  customizations: Record<string, ReadonlyArray<string>>,
) {
  let price = menuItem.price
  for (const customization of menuItem.customizations) {
    const selectedOptions = customizations[customization.name]
    if (selectedOptions) {
      for (const selectedOption of selectedOptions) {
        const option = customization.options.find(
          (option) => option.name === selectedOption,
        )
        if (option) {
          price += option.price
        }
      }
    }
  }
  return price
}

export function calculateFinalPrice(basePrice: number, fee: Fee): number {
  const recursedPrice =
    basePrice + basePrice * (fee.linearValue ?? 0) + (fee.constantValue ?? 0)
  const recursiveFeeValue =
    fee.recursiveFees?.reduce(
      (sum, fee) => sum + calculateFinalPrice(recursedPrice, fee),
      0,
    ) ?? 0
  return recursedPrice + recursiveFeeValue
}

export const defaultFee: Fee = {
  linearValue: 0.1, // service
  recursiveFees: [{ linearValue: 0.11 }],
}

export const formatPrice = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format
