import {
  CustomerId,
  GuestId,
  MenuItem,
  MenuItemId,
  MenuTagId,
  Restaurant,
  RestaurantId,
  Tab,
  TabId,
} from '../types'

// === RESTAURANTS ===
const restaurant1Id: RestaurantId = '1'
const restaurant2Id: RestaurantId = '2'
const restaurant3Id: RestaurantId = '3'

// === CUSTOMERS & GUESTS ===
const customer1Id: CustomerId = '32142ab8-e66d-4ba4-8ff0-953b940a0d32'
const customer2Id: CustomerId = '32142ab8-e66d-4ba4-8ff0-953b940a0d33'
const customer3Id: CustomerId = '32142ab8-e66d-4ba4-8ff0-953b940a0d34'
const customer4Id: CustomerId = '32142ab8-e66d-4ba4-8ff0-953b940a0d35'

const guest1Id: GuestId = '1'
const guest2Id: GuestId = '2'
const guest3Id: GuestId = '3'

// === MENU ITEMS (Restaurant 1) ===
const menuItem1Id: MenuItemId = `${restaurant1Id}.1`
const menuItem2Id: MenuItemId = `${restaurant1Id}.2`
const menuItem3Id: MenuItemId = `${restaurant1Id}.3`
const menuItem4Id: MenuItemId = `${restaurant1Id}.4`

const menuTag1Id: MenuTagId = `${restaurant1Id}.1`
const menuTag2Id: MenuTagId = `${restaurant1Id}.2`
const menuTag3Id: MenuTagId = `${restaurant1Id}.3`

const menuItem1: MenuItem = {
  id: menuItem1Id,
  name: 'Margherita Pizza',
  description: 'Classic pizza with tomatoes, mozzarella, and basil',
  photoPathinfo: '/images/margherita.jpg',
  price: 12.99,
  portionSize: 2,
  available: true,
  menuTagIds: [menuTag1Id],
  createdAt: new Date('2023-01-01T10:00:00Z'),
}

const menuItem2: MenuItem = {
  id: menuItem2Id,
  name: 'Caesar Salad',
  description: 'Crisp romaine lettuce with Caesar dressing and croutons',
  photoPathinfo: '/images/caesar_salad.jpg',
  price: 8.99,
  portionSize: 1,
  available: true,
  menuTagIds: [menuTag2Id],
  createdAt: new Date('2023-01-02T11:00:00Z'),
}

const menuItem3: MenuItem = {
  id: menuItem3Id,
  name: 'Spaghetti Carbonara',
  description: 'Rich pasta with eggs, pecorino cheese, pancetta, and pepper',
  photoPathinfo: '/images/carbonara.jpg',
  price: 14.5,
  portionSize: 1,
  available: true,
  menuTagIds: [menuTag3Id],
  createdAt: new Date('2023-01-03T11:30:00Z'),
}

const menuItem4: MenuItem = {
  id: menuItem4Id,
  name: 'Tiramisu',
  description: 'Classic Italian dessert with coffee and mascarpone',
  photoPathinfo: '/images/tiramisu.jpg',
  price: 6.5,
  portionSize: 1,
  available: true,
  menuTagIds: [menuTag1Id, menuTag2Id],
  createdAt: new Date('2023-01-04T12:00:00Z'),
}

// === MENU ITEMS (Restaurant 2) ===
const menuItem5Id: MenuItemId = `${restaurant2Id}.1`
const menuItem6Id: MenuItemId = `${restaurant2Id}.2`
const menuItem7Id: MenuItemId = `${restaurant2Id}.3`

const menuTag4Id: MenuTagId = `${restaurant2Id}.1`
const menuTag5Id: MenuTagId = `${restaurant2Id}.2`
const menuTag6Id: MenuTagId = `${restaurant2Id}.3`

const menuItem5: MenuItem = {
  id: menuItem5Id,
  name: 'Sushi Platter',
  description: 'Assorted nigiri and rolls with soy sauce and wasabi',
  photoPathinfo: '/images/sushi_platter.jpg',
  price: 22.0,
  portionSize: 2,
  available: true,
  menuTagIds: [menuTag4Id, menuTag5Id],
  createdAt: new Date('2023-02-01T10:00:00Z'),
}

const menuItem6: MenuItem = {
  id: menuItem6Id,
  name: 'Miso Soup',
  description: 'Traditional Japanese soup with tofu and seaweed',
  photoPathinfo: '/images/miso_soup.jpg',
  price: 4.99,
  portionSize: 1,
  available: true,
  menuTagIds: [menuTag6Id],
  createdAt: new Date('2023-02-02T10:00:00Z'),
}

const menuItem7: MenuItem = {
  id: menuItem7Id,
  name: 'Tempura Shrimp',
  description: 'Crispy battered shrimp served with dipping sauce',
  photoPathinfo: '/images/tempura_shrimp.jpg',
  price: 12.5,
  portionSize: 1,
  available: true,
  menuTagIds: [],
  createdAt: new Date('2023-02-03T11:00:00Z'),
}

// === MENU ITEMS (Restaurant 3) ===
const menuItem8Id: MenuItemId = `${restaurant3Id}.1`
const menuItem9Id: MenuItemId = `${restaurant3Id}.2`

const menuItem8: MenuItem = {
  id: menuItem8Id,
  name: 'Cheeseburger',
  description: 'Juicy beef patty with cheddar cheese, lettuce, and tomato',
  photoPathinfo: '/images/cheeseburger.jpg',
  price: 10.99,
  portionSize: 1,
  available: true,
  menuTagIds: [],
  createdAt: new Date('2023-03-01T10:00:00Z'),
}

const menuItem9: MenuItem = {
  id: menuItem9Id,
  name: 'French Fries',
  description: 'Crispy golden fries with sea salt',
  photoPathinfo: '/images/french_fries.jpg',
  price: 3.99,
  portionSize: 1,
  available: true,
  menuTagIds: [],
  createdAt: new Date('2023-03-02T11:00:00Z'),
}

// === TABS ===
const tab1Id: TabId = '32142ab8-e66d-4ba4-8ff0-953b940a0d31'
const tab2Id: TabId = '42142ab8-e66d-4ba4-8ff0-953b940a0d32'
const tab3Id: TabId = '52142ab8-e66d-4ba4-8ff0-953b940a0d33'

// Tab for restaurant 1
const tab1: Tab = {
  id: tab1Id,
  restaurantId: restaurant1Id,
  createdAt: new Date('2025-11-01T12:30:00Z'),
  orders: [
    {
      id: `${tab1Id}.1`,
      sentAt: new Date('2025-11-01T12:35:00Z'),
      items: [
        {
          id: `${tab1Id}.1.1`,
          quantity: 2,
          ownerIds: [guest1Id],
          menuItemId: menuItem1Id,
        },
        {
          id: `${tab1Id}.1.2`,
          quantity: 1,
          ownerIds: [customer1Id],
          menuItemId: menuItem2Id,
        },
      ],
    },
    {
      id: `${tab1Id}.2`,
      sentAt: new Date('2025-11-01T13:00:00Z'),
      items: [
        {
          id: `${tab1Id}.2.1`,
          quantity: 3,
          ownerIds: [guest1Id, customer1Id, guest2Id, customer2Id],
          menuItemId: menuItem3Id,
        },
      ],
    },
  ],
}

// Tab for restaurant 2
const tab2: Tab = {
  id: tab2Id,
  restaurantId: restaurant2Id,
  createdAt: new Date('2025-11-02T18:00:00Z'),
  orders: [
    {
      id: `${tab2Id}.1`,
      sentAt: new Date('2025-11-02T18:10:00Z'),
      items: [
        {
          id: `${tab2Id}.1.1`,
          quantity: 1,
          ownerIds: [guest2Id, customer3Id],
          menuItemId: menuItem5Id,
        },
        {
          id: `${tab2Id}.1.2`,
          quantity: 2,
          ownerIds: [guest2Id, customer3Id, guest3Id, customer4Id],
          menuItemId: menuItem6Id,
        },
      ],
    },
  ],
}

// Tab for restaurant 3
const tab3: Tab = {
  id: tab3Id,
  restaurantId: restaurant3Id,
  createdAt: new Date('2025-11-03T20:45:00Z'),
  orders: [
    {
      id: `${tab3Id}.1`,
      sentAt: new Date('2025-11-03T20:50:00Z'),
      items: [
        {
          id: `${tab3Id}.1.1`,
          quantity: 2,
          ownerIds: [guest1Id, customer4Id],
          menuItemId: menuItem8Id,
        },
        {
          id: `${tab3Id}.1.2`,
          quantity: 1,
          ownerIds: [customer4Id],
          menuItemId: menuItem9Id,
        },
      ],
    },
  ],
}

// === EXPORTS ===
export const tabs: Map<TabId, Tab> = new Map<TabId, Tab>([
  [tab1.id, tab1],
  [tab2.id, tab2],
  [tab3.id, tab3],
])

export const visitedTabs: Map<CustomerId, Tab[]> = new Map<CustomerId, Tab[]>([
  [customer1Id, [tab1]],
  [customer2Id, [tab1]],
  [customer3Id, [tab2]],
  [customer4Id, [tab2, tab3]],
])

export const restaurants: Map<RestaurantId, Restaurant> = new Map<
  RestaurantId,
  Restaurant
>([
  [
    restaurant1Id,
    {
      id: restaurant1Id,
      name: 'La Tavola Italiana',
      photoPathinfo: '/images/restaurants/la_tavola.jpg',
      address: '123 Via Roma, Florence, Italy',
    },
  ],
  [
    restaurant2Id,
    {
      id: restaurant2Id,
      name: 'Sakura Sushi Bar',
      photoPathinfo: '/images/restaurants/sakura_sushi.jpg',
      address: '88 Cherry Blossom Ave, Tokyo, Japan',
    },
  ],
  [
    restaurant3Id,
    {
      id: restaurant3Id,
      name: 'Burger Haven',
      photoPathinfo: '/images/restaurants/burger_haven.jpg',
      address: '742 Evergreen Terrace, Springfield, USA',
    },
  ],
])

export const restaurantMenu = new Map<RestaurantId, Map<MenuItemId, MenuItem>>([
  [
    restaurant1Id,
    new Map<MenuItemId, MenuItem>([
      [menuItem1.id, menuItem1],
      [menuItem2.id, menuItem2],
      [menuItem3.id, menuItem3],
      [menuItem4.id, menuItem4],
    ]),
  ],
  [
    restaurant2Id,
    new Map<MenuItemId, MenuItem>([
      [menuItem5.id, menuItem5],
      [menuItem6.id, menuItem6],
      [menuItem7.id, menuItem7],
    ]),
  ],
  [
    restaurant3Id,
    new Map<MenuItemId, MenuItem>([
      [menuItem8.id, menuItem8],
      [menuItem9.id, menuItem9],
    ]),
  ],
])
