'use client'

import { createContext } from 'react'
import { MenuItem, MenuItemId, Tab } from '@/lib/types'

export const MenuContext = createContext<Map<MenuItemId, MenuItem> | null>(null)
export const TabContext = createContext<Tab | null>(null)

export function MenuProvider({
  menu,
  children,
}: {
  menu: Map<MenuItemId, MenuItem>
  children: React.ReactNode
}) {
  return <MenuContext value={menu}>{children}</MenuContext>
}
