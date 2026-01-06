import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { LocalOrderItem } from '@/lib/types'
import OrderItemCustomizations from '@/components/order-item-customizations'
import { calculateOrderItemPrice, formatPrice } from '@/lib/price'
import { Doc } from '@/convex/_generated/dataModel'
import { Edit2Icon, UsersIcon } from 'lucide-react'
import { Button } from './ui/button'
import PreparedCustomizationsConfigurator from './prepared-customizations-configurator'
import PreparedQuantityUpdater from './prepared-quantity-updater'

export default function PreparedMenuOrderItem({
  orderItem,
  menuItem,
}: {
  orderItem: LocalOrderItem
  menuItem: Pick<
    Doc<'menuItems'>,
    '_id' | 'name' | 'description' | 'price' | 'customizations'
  >
}) {
  return (
    <Item>
      <ItemHeader>
        <div className="flex flex-row items-center">
          <UsersIcon /> {orderItem.ownerCount}
        </div>
      </ItemHeader>
      <ItemContent>
        <ItemTitle className="w-auto self-stretch gap-6">
          <OrderItemCustomizations
            customizations={Object.entries(orderItem.customizations)}
          />
        </ItemTitle>
        <ItemDescription>
          {formatPrice(
            calculateOrderItemPrice(menuItem, orderItem.customizations),
          )}
        </ItemDescription>
      </ItemContent>
      <ItemActions className="flex-col">
        <PreparedCustomizationsConfigurator
          trigger={
            <Button variant="ghost" vibe="friendly" size="sm">
              <Edit2Icon />
              Edit
            </Button>
          }
          orderItem={orderItem}
          menuItem={menuItem}
        />
        <PreparedQuantityUpdater
          orderItemId={orderItem.id}
          quantity={orderItem.quantity}
        />
      </ItemActions>
    </Item>
  )
}
