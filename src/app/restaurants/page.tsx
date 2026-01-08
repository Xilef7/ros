'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { api } from '@/convex/_generated/api'
import { usePaginatedQuery } from 'convex/react'
import { AsteriskIcon, ImageOffIcon } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Separator } from '@/components/ui/separator'

export default function RestaurantsPage() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.restaurants.list,
    {},
    { initialNumItems: 5 },
  )

  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!loadMoreRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && status === 'CanLoadMore') {
          loadMore(5)
        }
      },
      { rootMargin: '200px' }, // start loading a bit early
    )

    observer.observe(loadMoreRef.current)

    return () => observer.disconnect()
  }, [status, loadMore])

  return (
    <main className="flex flex-col self-stretch p-4 items-stretch">
      <h1 className="text-2xl font-semibold w-full">Browse Restaurants</h1>

      <ItemGroup className="my-4 gap-4">
        {results.map((restaurant) => (
          <Item key={restaurant._id} variant="outline">
            <ItemMedia variant={restaurant.photoPathinfo ? 'image' : 'icon'}>
              {restaurant.photoPathinfo ? (
                <Image
                  src={restaurant.photoPathinfo}
                  alt={restaurant.name}
                  width={400}
                  height={160}
                />
              ) : (
                <ImageOffIcon />
              )}
            </ItemMedia>

            <ItemContent>
              <ItemTitle>{restaurant.name}</ItemTitle>
              <ItemDescription>{restaurant.address}</ItemDescription>
            </ItemContent>

            <ItemActions>
              <Button asChild>
                <Link href={`/restaurants/${restaurant._id}`}>See Menu</Link>
              </Button>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>

      <div ref={loadMoreRef} style={{ height: 1 }} />
      {(status === 'LoadingFirstPage' || status === 'LoadingMore') && (
        <Spinner className="size-16 self-center" />
      )}
      {status === 'Exhausted' && (
        <span className="flex items-center">
          <Separator className="flex-1 mr-2" decorative />
          {Array.from({ length: 3 }).map((_, index) => (
            <AsteriskIcon key={index} className="size-4" />
          ))}
          <Separator className="flex-1 ml-2" decorative />
        </span>
      )}
    </main>
  )
}
