import { ItemGroup } from '@/components/ui/item'
import { OwnerId, TabId } from '@/lib/types'
import { formatPrice } from '@/lib/price'
import { ReactNode, Children } from 'react'
import OwnerOrderEmptyItems from './owner-order-items-empty'

export default function OwnerOrderItemsGroup({
  ownerId,
  isMine,
  totalPrice,
  headerPrefix,
  children,
  renderName,
  renderPossessiveName,
  renderAvatar,
  ...isTabOpenAndTabId
}: {
  ownerId: OwnerId
  isMine: boolean
  totalPrice?: number
  headerPrefix?: ReactNode
  children?: ReactNode
  renderName: (ownerId: OwnerId) => ReactNode
  renderPossessiveName: (ownerId: OwnerId) => ReactNode
  renderAvatar: (ownerId: OwnerId) => ReactNode
} & ({ isTabOpen: true; tabId: TabId } | { isTabOpen: false; tabId?: TabId })) {
  return (
    <ItemGroup className="border border-muted-foreground rounded-md m-2 bg-neutral-50">
      <div className="flex items-center gap-2 m-2">
        {headerPrefix}
        {renderAvatar(ownerId)}
        <span className="flex-1 font-normal align-middle">
          {isMine ? 'My' : renderPossessiveName(ownerId)}
          {' order items'}
        </span>
        {totalPrice !== undefined && (
          <span className="font-medium text-base align-middle mx-3">
            Total:{' '}
            <span className="font-semibold text-lg text-primary">
              {formatPrice(totalPrice)}
            </span>
          </span>
        )}
      </div>
      {Children.count(children) > 0 ? (
        children
      ) : (
        <OwnerOrderEmptyItems
          nameIfNotMine={isMine ? null : renderName(ownerId)}
          {...isTabOpenAndTabId}
        />
      )}
    </ItemGroup>
  )
}
