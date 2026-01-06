import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export const userId = v.union(
  v.object({
    kind: v.literal('CustomerId'),
    value: v.string(),
  }),
  v.object({
    kind: v.literal('GuestId'),
    value: v.string(),
  }),
)

export default defineSchema({
  tabVisitations: defineTable({
    customerId: v.string(),
    tabId: v.id('tabs'),
  })
    .index('by_customer_id', ['customerId'])
    .index('by_tab_id', ['tabId', 'customerId']),
  tabs: defineTable({
    restaurantId: v.id('restaurants'),
    closedAt: v.nullable(v.number()),
    guestSequenceId: v.number(),
    guestNames: v.record(v.string(), v.string()),
    customerNames: v.record(v.string(), v.string()),
    orders: v.array(
      v.object({
        id: v.string(),
        sentAt: v.number(),
        items: v.array(
          v.object({
            id: v.string(),
            menuItemId: v.id('menuItems'),
            price: v.number(),
            quantity: v.number(),
            customizations: v.record(v.string(), v.array(v.string())),
            ownerIds: v.array(userId),
          }),
        ),
      }),
    ),
    paidOwnerIds: v.array(userId),
  }),
  menuItems: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    photoPathinfo: v.optional(v.string()),
    price: v.number(),
    portionSize: v.number(),
    customizations: v.array(
      v.object({
        name: v.string(),
        minRequired: v.number(),
        maxAdditional: v.number(),
        options: v.array(
          v.object({
            name: v.string(),
            price: v.number(),
          }),
        ),
      }),
    ),
    available: v.boolean(),
    updatedAt: v.number(),
    deletedAt: v.optional(v.number()),
  }),
  restaurants: defineTable({
    name: v.string(),
    photoPathinfo: v.optional(v.string()),
    address: v.string(),
    openTime: v.object({
      hour: v.number(),
      minute: v.number(),
    }),
    closeTime: v.object({
      hour: v.number(),
      minute: v.number(),
    }),
    menu: v.array(v.id('menuItems')),
  }),
})
