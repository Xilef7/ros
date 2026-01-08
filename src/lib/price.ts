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

export function calculateFee(basePrice: number, fee: Fee): number {
  const feeValue = basePrice * (fee.linearValue ?? 0) + (fee.constantValue ?? 0)
  const recursiveFeeValue =
    fee.recursiveFees?.reduce(
      (sum, recursiveFee) =>
        sum + calculateFee(basePrice + feeValue, recursiveFee),
      0,
    ) ?? 0
  return feeValue + recursiveFeeValue
}

export const defaultFee: Fee = {
  name: 'service',
  linearValue: 0.1,
  recursiveFees: [
    {
      name: 'tax',
      linearValue: 0.11,
    },
  ],
}

export const formatPrice = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format

export const formatFee = (fee: Fee): string =>
  `${fee.name} ${[fee.linearValue && new Intl.NumberFormat('en-US', { style: 'percent' }).format(fee.linearValue), fee.constantValue && formatPrice(fee.constantValue)].filter((value) => value).join(' + ')}` +
  (fee.recursiveFees ?? []).map((fee) => ', ' + formatFee(fee)).join('')
