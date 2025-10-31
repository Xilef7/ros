export type RestaurantId = `${number}`

export type MenuItemId = `${RestaurantId}-${number}`

export type MenuItem = {
  id: MenuItemId
  name: string
  description?: string
  photoPathinfo: string
  price: number
  portionSize: number
  available: boolean
  menuTags: MenuTag[]
  createdAt: Date
}

export type MenuTagId = `${RestaurantId}-${number}`

export type MenuTag = {
  id: MenuTagId
  value: string
  description: string
  dimension: string
  prerequisites: MenuTag[]
  createdAt: Date
  deletedAt?: Date
}

// Sample data
const data = new Map<RestaurantId, Map<MenuItemId, MenuItem>>([
  [
    '1',
    new Map<MenuItemId, MenuItem>([
      [
        '1-1',
        {
          id: '1-1',
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomatoes, mozzarella, and basil',
          photoPathinfo: '/images/margherita.jpg',
          price: 12.99,
          portionSize: 1,
          available: true,
          menuTags: [],
          createdAt: new Date('2023-01-01T10:00:00Z'),
        },
      ],
      [
        '1-2',
        {
          id: '1-2',
          name: 'Caesar Salad',
          description:
            'Crisp romaine lettuce with Caesar dressing and croutons',
          photoPathinfo: '/images/caesar_salad.jpg',
          price: 8.99,
          portionSize: 1,
          available: true,
          menuTags: [],
          createdAt: new Date('2023-01-02T11:00:00Z'),
        },
      ],
    ]),
  ],
])

export function getMenu(restaurantId: RestaurantId) {
  return data.get(restaurantId)
}

export function getCategorizedMenu(restaurantId: RestaurantId) {
  const menuItemMap = data.get(restaurantId)
  const sortedMenu = menuItemMap
    ? Array.from(menuItemMap.values()).sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      )
    : []
  return sortedMenu
}
