import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { TabId } from '@/lib/types'
import { UtensilsCrossedIcon, UtensilsIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

export default function OwnerOrderEmptyItems({
  isTabOpen,
  tabId,
  nameIfNotMine,
}: {
  nameIfNotMine?: ReactNode
} & ({ isTabOpen: true; tabId: TabId } | { isTabOpen: false; tabId?: TabId })) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {isTabOpen ? <UtensilsIcon /> : <UtensilsCrossedIcon />}
        </EmptyMedia>
        <EmptyTitle>{isTabOpen ? 'No Orders Yet' : 'No Orders'}</EmptyTitle>
        <EmptyDescription>
          {nameIfNotMine ?? 'You'}{' '}
          {isTabOpen ? 'have not ordered yet.' : 'did not order.'}
          <br />
          {!nameIfNotMine &&
            isTabOpen &&
            'See restaurant menu to start ordering.'}
        </EmptyDescription>
      </EmptyHeader>
      {isTabOpen && (
        <EmptyContent>
          <Button asChild>
            <Link href={`/tabs/${tabId}/menu`}>See Menu</Link>
          </Button>
        </EmptyContent>
      )}
    </Empty>
  )
}
