'use client'

import MenuItems from '@/components/menu-items'
import PreparedMenuOrderItems from '@/components/prepared-menu-order-items'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Doc } from '@/convex/_generated/dataModel'
import { MenuItemId } from '@/lib/types'
import { SearchIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

export default function MenuBrowser({
  menu,
}: {
  menu: Record<MenuItemId, Doc<'menuItems'>>
}) {
  const [searchQuery, setSearchQuery] = useState('')

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
      <div className="sticky self-stretch top-0 z-10 bg-linear-to-b from-orange-50 to-transparent p-2 mt-4">
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
            <PreparedMenuOrderItems menuItem={menuItem} />
          )}
        />
      </main>
    </>
  )
}
