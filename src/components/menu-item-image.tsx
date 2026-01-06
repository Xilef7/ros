import { RestaurantId, TabId } from '@/lib/types'
import { ImageOffIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ComponentProps } from 'react'
import { Spinner } from './ui/spinner'
import { Doc } from '@/convex/_generated/dataModel'

export default function MenuItemImage({
  isTabOpen,
  tabId,
  restaurantId,
  menuItem,
  size,
  ...imageProps
}: Omit<ComponentProps<typeof Image>, 'src' | 'alt'> & {
  menuItem: Pick<Doc<'menuItems'>, '_id' | 'photoPathinfo' | 'name'> | undefined
  size: number
} & (
    | { isTabOpen: true; tabId: TabId; restaurantId?: RestaurantId }
    | { isTabOpen: false; restaurantId: RestaurantId; tabId?: TabId }
  )) {
  if (!menuItem) {
    return <Spinner />
  }

  const { _id: menuItemId, photoPathinfo, name } = menuItem

  return (
    <Link
      href={
        isTabOpen
          ? `/tabs/${tabId}/menu#${menuItemId}`
          : `/restaurants/${restaurantId}#${menuItemId}`
      }
    >
      {photoPathinfo ? (
        <Image src={photoPathinfo} alt={name} {...imageProps} />
      ) : (
        <ImageOffIcon size={size} />
      )}
    </Link>
  )
}
