import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import Image from 'next/image'
import { Fragment, ReactNode } from 'react'
import { ImageOffIcon } from 'lucide-react'
import { formatPrice } from '@/lib/price'
import { Doc } from '@/convex/_generated/dataModel'
import { Badge } from './ui/badge'

export default function MenuItems({
  menuItems,
  renderActions,
}: {
  menuItems: Doc<'menuItems'>[]
  renderActions?: (menuItem: Doc<'menuItems'>) => ReactNode
}) {
  return (
    <ItemGroup>
      {menuItems.map((menuItem, index) => {
        return (
          <Fragment key={menuItem._id}>
            <Item>
              <ItemMedia
                variant={menuItem.photoPathinfo ? 'image' : 'icon'}
                className="size-24"
              >
                {menuItem.photoPathinfo ? (
                  <Image
                    src={menuItem.photoPathinfo}
                    alt={menuItem.name}
                    width={256}
                    height={256}
                  />
                ) : (
                  <ImageOffIcon size={24} />
                )}
              </ItemMedia>
              <ItemContent>
                <ItemTitle
                  className={`text-lg font-bold ${menuItem.available ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  {menuItem.name}
                  {!menuItem.available && (
                    <Badge variant="outline">Unavailable</Badge>
                  )}
                </ItemTitle>
                <ItemDescription>{menuItem.description}</ItemDescription>
                <div className="flex flex-row mt-2">
                  <div className="flex-1">
                    <div className="font-semibold text-chart-3 text-base">
                      {formatPrice(menuItem.price)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {menuItem.portionSize} serving
                      {menuItem.portionSize > 1 && 's'}
                    </div>
                  </div>
                  {renderActions && (
                    <ItemActions>{renderActions(menuItem)}</ItemActions>
                  )}
                </div>
              </ItemContent>
            </Item>
            {index !== menuItems.length - 1 && <ItemSeparator />}
          </Fragment>
        )
      })}
    </ItemGroup>
  )
}
