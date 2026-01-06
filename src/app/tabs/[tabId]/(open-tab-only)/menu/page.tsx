'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { NotepadTextIcon, SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MenuItems from '@/components/menu-items'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { ButtonGroup } from '@/components/ui/button-group'
import { ClientSideSuspense } from '@liveblocks/react/suspense'
import { Spinner } from '@/components/ui/spinner'
import { useTabMenu } from '@/lib/hooks/convex'
import { Doc } from '@/convex/_generated/dataModel'
import MenuOrderItems from '@/components/menu-order-items'

export default function MenuPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const menu = useTabMenu()
  if (typeof menu === 'object' && 'error' in menu) {
    throw new Error(menu.error)
  }

  const sortedFilteredMenu = useMemo(() => {
    if (!menu) return [] as Doc<'menuItems'>[]
    return Object.values(menu)
      .filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .sort((a, b) => b._creationTime - a._creationTime)
  }, [menu, searchQuery])

  return (
    <>
      <div className="sticky self-stretch top-0 z-10 bg-linear-to-b from-orange-50 to-transparent p-2">
        <InputGroup className="rounded-full border-2 border-primary bg-white h-10">
          <InputGroupInput
            type="search"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search menu items"
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <main className="self-stretch">
        <MenuItems
          menuItems={sortedFilteredMenu}
          renderActions={(menuItem) => (
            <ClientSideSuspense fallback={<Spinner className="min-w-30" />}>
              <MenuOrderItems menuItem={menuItem} />
            </ClientSideSuspense>
          )}
        />
      </main>

      <ButtonGroup className="fixed bottom-0 w-screen z-10 p-2 pb-4">
        <Button
          onClick={() => router.push(`order/current`)}
          variant="default"
          vibe="friendly"
          className="w-full h-10"
          aria-label="Check Order"
        >
          <NotepadTextIcon />
          <span>Check Order</span>
        </Button>
      </ButtonGroup>
    </>
  )
}
