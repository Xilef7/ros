import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import OwnerStack, { AdditionalAvatar } from './owner-stack'
import OwnerAvatar from './user-avatar-client'
import QuantityUpdater from './quantity-updater'
import { LiveOrderItem } from '@/lib/types'
import { OwnerButtonSelfCurrent } from './owner-button-self'
import OrderItemCustomizations from '@/components/order-item-customizations'
import { calculateOrderItemPrice, formatPrice } from '@/lib/price'
import { OwnerUpdaterCurrent } from './owner-updater'
import { Doc } from '@/convex/_generated/dataModel'
import CustomizationsConfigurator from './customizations-configurator'
import { Edit2Icon } from 'lucide-react'
import { Button } from './ui/button'
import { ToImmutable } from '@liveblocks/client'

export default function MenuOrderItem({
  orderItem,
  menuItem,
}: {
  orderItem: ToImmutable<LiveOrderItem>
  menuItem: Pick<
    Doc<'menuItems'>,
    '_id' | 'name' | 'description' | 'price' | 'customizations'
  >
}) {
  return (
    <Item>
      <ItemHeader>
        <div className="flex flex-row items-center">
          <OwnerStack>
            {orderItem.ownerIds.map((ownerId) => (
              <OwnerAvatar key={ownerId} id={ownerId} />
            ))}
            <AdditionalAvatar>
              <OwnerUpdaterCurrent
                orderItemId={orderItem.id}
                ownerIds={orderItem.ownerIds}
              />
            </AdditionalAvatar>
          </OwnerStack>
          <OwnerButtonSelfCurrent
            orderItemId={orderItem.id}
            ownerIds={orderItem.ownerIds}
          />
        </div>
      </ItemHeader>
      <ItemContent>
        <ItemTitle className="w-auto self-stretch gap-6">
          <OrderItemCustomizations
            customizations={orderItem.customizations.entries().toArray()}
          />
        </ItemTitle>
        <ItemDescription>
          {formatPrice(
            calculateOrderItemPrice(
              menuItem,
              Object.fromEntries(orderItem.customizations.entries()),
            ),
          )}
        </ItemDescription>
      </ItemContent>
      <ItemActions className="flex-col">
        <CustomizationsConfigurator
          trigger={
            <Button variant="ghost" vibe="friendly" size="sm">
              <Edit2Icon />
              Edit
            </Button>
          }
          orderItem={orderItem}
          menuItem={menuItem}
        />
        <QuantityUpdater
          orderItemId={orderItem.id}
          quantity={orderItem.quantity}
        />
      </ItemActions>
    </Item>
  )
}
