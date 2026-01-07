import { notFound } from 'next/navigation'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { RestaurantId } from '@/lib/types'
import Cover from '@/components/cover'
import MenuBrowser from './menu-browser'
import { ButtonGroup } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { NotepadTextDashedIcon } from 'lucide-react'
import CreateTabButton from './CreateTab'

export default async function Page({
  params,
}: PageProps<'/restaurants/[restaurantId]'>) {
  const { restaurantId } = await params
  const restaurant = await fetchQuery(api.restaurants.get, {
    restaurantId: restaurantId as RestaurantId,
  })

  if ('error' in restaurant) {
    switch (restaurant.error) {
      case 'RESTAURANT_NOT_FOUND':
        notFound()
      default:
        throw restaurant.error
    }
  }

  return (
    <>
      <main className="self-stretch">
        <Cover photoPathinfo={restaurant.photoPathinfo} name={restaurant.name}>
          <div className="flex items-center w-full">
            <div className="flex flex-col flex-1">
              <span className="text-white text-xl font-semibold">
                {restaurant.name}
              </span>
              <div className="text-gray-300 text-base font-medium">
                {restaurant.address}
              </div>
            </div>
            <CreateTabButton restaurantId={restaurantId as RestaurantId} />
          </div>
        </Cover>
        <MenuBrowser menu={restaurant.menu} />
      </main>

      <ButtonGroup className="fixed bottom-0 w-screen z-10 p-2 pb-4">
        <Button
          variant="default"
          vibe="friendly"
          className="w-full h-10"
          aria-label="Check Order"
          asChild
        >
          <Link href="order/current">
            <NotepadTextDashedIcon />
            Check Saved Order
          </Link>
        </Button>
      </ButtonGroup>
    </>
  )
}
