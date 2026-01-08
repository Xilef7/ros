import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { RestaurantId } from '@/lib/types'
import { UtensilsIcon } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'

export default function PreparedOrderEmptyItems({
  restaurantId,
}: {
  restaurantId: RestaurantId
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UtensilsIcon />
        </EmptyMedia>
        <EmptyTitle>No Orders Yet</EmptyTitle>
        <EmptyDescription>
          You have not prepared any orders yet.
          <br />
          See restaurant menu to save order.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link href={`/restaurantId/${restaurantId}`}>See Menu</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}
