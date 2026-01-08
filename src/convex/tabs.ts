import { ConvexError, Infer, v } from 'convex/values'
import { internalAction, mutation, query, QueryCtx } from './_generated/server'
import { calculateOrderItemPrice } from '@/lib/price'
import { paginationOptsValidator } from 'convex/server'
import { Doc, Id } from './_generated/dataModel'
import { getAvailableMenuItems } from './restaurants'
import { userId } from './schema'
import { liveblocks } from '@/lib/liveblocks'
import { internal } from './_generated/api'
import { convertDbToStrOwnerId, convertStrToDbOwnerId } from '@/lib/types'

async function tryCatch<T>(fn: () => Promise<T>) {
  try {
    return await fn()
  } catch (error) {
    return { error: error instanceof ConvexError ? error.data : error }
  }
}

export const get = query({
  args: {
    tabId: v.id('tabs'),
  },
  handler: (ctx, args) =>
    tryCatch(async () => {
      const tab = await ctx.db.get(args.tabId)
      if (!tab) {
        throw new ConvexError('TAB_NOT_FOUND')
      }

      const isFullyPaid = isTabFullyPaid(tab)

      if (isFullyPaid) {
        if (Date.now() - tab.closedAt! > 3 * 60 * 60 * 1000) {
          const identity = await ctx.auth.getUserIdentity()
          if (identity === null) {
            throw new ConvexError('NOT_AUTHENTICATED')
          }

          const visitation = await ctx.db
            .query('tabVisitations')
            .withIndex('by_customer_id', (q) =>
              q.eq('customerId', identity.subject),
            )
            .first()
          if (!visitation) {
            throw new ConvexError('NOT_AUTHORIZED')
          }
        }
      }

      const restaurant = await ctx.db.get(tab.restaurantId)
      if (!restaurant) {
        throw new ConvexError('RESTAURANT_NOT_FOUND')
      }

      const menuItems = await getAvailableMenuItems(ctx, tab.restaurantId)

      const visitations = await ctx.db
        .query('tabVisitations')
        .withIndex('by_tab_id', (q) => q.eq('tabId', args.tabId))
        .collect()
      const customerIds = visitations.map((visitation) => visitation.customerId)

      return {
        ...tab,
        customerIds,
        isFullyPaid,
        restaurant,
        menuItems,
      }
    }),
})

export const list = query({
  args: {
    customerId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: (ctx, args) =>
    tryCatch(async () => {
      const identity = await ctx.auth.getUserIdentity()
      if (identity === null) {
        throw new ConvexError('NOT_AUTHENTICATED')
      }

      if (identity.subject !== args.customerId) {
        throw new ConvexError('NOT_AUTHORIZED')
      }

      const results = await ctx.db
        .query('tabVisitations')
        .withIndex('by_customer_id', (q) => q.eq('customerId', args.customerId))
        .order('desc')
        .paginate(args.paginationOpts)

      return {
        ...results,
        page: await Promise.all(
          results.page.map(
            async (visitation) =>
              (await ctx.db.get(visitation.tabId)) ?? { _id: visitation.tabId },
          ),
        ),
      }
    }),
})

export const create = mutation({
  args: {
    restaurantId: v.id('restaurants'),
  },
  handler: async (ctx, args) => {
    const tabId = await ctx.db.insert('tabs', {
      restaurantId: args.restaurantId,
      orders: [],
      closedAt: null,
      guestSequenceId: 0,
      guestNames: {},
      customerNames: {},
      paidOwnerIds: [],
    })
    await ctx.scheduler.runAfter(0, internal.tabs.createRoom, {
      tabId,
    })
    return tabId
  },
})

export const createRoom = internalAction({
  args: {
    tabId: v.id('tabs'),
  },
  handler: async (ctx, args) => {
    await liveblocks.createRoom(
      args.tabId,
      {
        defaultAccesses: ['room:write'],
      },
      {
        idempotent: true,
      },
    )
  },
})

export const visit = mutation({
  args: {
    tabId: v.id('tabs'),
    customerId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (identity === null) {
      throw new ConvexError('NOT_AUTHENTICATED')
    }

    if (identity.subject !== args.customerId) {
      throw new ConvexError('NOT_AUTHORIZED')
    }

    const tab = await ctx.db.get(args.tabId)
    if (!tab) {
      throw new ConvexError('TAB_NOT_FOUND')
    }

    if (tab.closedAt) {
      throw new ConvexError('TAB_CLOSED')
    }

    const visitation = await ctx.db
      .query('tabVisitations')
      .withIndex('by_tab_id', (q) =>
        q.eq('tabId', args.tabId).eq('customerId', args.customerId),
      )
      .first()
    if (visitation) {
      return
    }

    await ctx.db.insert('tabVisitations', {
      tabId: args.tabId,
      customerId: args.customerId,
    })
  },
})

export const addGuest = mutation({
  args: {
    tabId: v.id('tabs'),
    guestName: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.guestName.length == 0) {
      throw new ConvexError('GUEST_NAME_INVALID')
    }

    const tab = await ctx.db.get(args.tabId)
    if (!tab) {
      throw new ConvexError('TAB_NOT_FOUND')
    }

    if (tab.closedAt) {
      throw new ConvexError('TAB_CLOSED')
    }

    const guestSequenceId = tab.guestSequenceId + 1
    const guestId = `${args.tabId}.${guestSequenceId}`

    await ctx.db.patch(args.tabId, {
      guestSequenceId,
      guestNames: {
        ...tab.guestNames,
        [guestId]: args.guestName,
      },
    })

    return guestId
  },
})

export const renameGuest = mutation({
  args: {
    tabId: v.id('tabs'),
    guestId: v.number(),
    guestName: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.guestName.length == 0) {
      throw new ConvexError('GUEST_NAME_INVALID')
    }

    const tab = await ctx.db.get(args.tabId)
    if (!tab) {
      throw new ConvexError('TAB_NOT_FOUND')
    }

    if (tab.closedAt) {
      throw new ConvexError('TAB_CLOSED')
    }

    await ctx.db.patch(args.tabId, {
      guestNames: {
        ...tab.guestNames,
        [args.guestId]: args.guestName,
      },
    })
  },
})

export const sendOrder = mutation({
  args: {
    tabId: v.id('tabs'),
    items: v.array(
      v.object({
        menuItemId: v.id('menuItems'),
        quantity: v.number(),
        customizations: v.record(v.string(), v.array(v.string())),
        ownerIds: v.array(
          v.union(
            v.object({
              kind: v.literal('CustomerId'),
              value: v.string(),
            }),
            v.object({
              kind: v.literal('GuestId'),
              value: v.string(),
            }),
          ),
        ),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const tab = await ctx.db.get(args.tabId)
    if (!tab) {
      throw new ConvexError('TAB_NOT_FOUND')
    }

    if (tab.closedAt) {
      throw new ConvexError('TAB_CLOSED')
    }

    const newOrderId = `${args.tabId}.${tab.orders.length + 1}`

    await ctx.db.patch(args.tabId, {
      orders: [
        ...tab.orders,
        {
          id: newOrderId,
          sentAt: Date.now(),
          items: await Promise.all(
            args.items.map(async (orderItem, index) => {
              const menuItem = await ctx.db.get(orderItem.menuItemId)
              if (!menuItem) {
                throw new ConvexError('MENU_ITEM_NOT_FOUND')
              }

              const ownerChecks = await Promise.all(
                orderItem.ownerIds.map((ownerId) =>
                  checkOwner(ctx, args.tabId, ownerId),
                ),
              )
              if (ownerChecks.some((check) => !check)) {
                throw new ConvexError('OWNER_ID_INVALID')
              }

              const customizationKeysConfig = new Set(
                menuItem.customizations.map(
                  (customization) => customization.name,
                ),
              )
              const customizationKeys = new Set(
                Object.keys(orderItem.customizations),
              )
              if (
                customizationKeys.difference(customizationKeysConfig).size !== 0
              ) {
                throw new Error('CUSTOMIZATION_GROUP_INVALID')
              }

              for (const [group, customization] of Object.entries(
                orderItem.customizations,
              )) {
                const customizationConfig = menuItem.customizations.find(
                  ({ name }) => name === group,
                )
                if (customizationConfig === undefined) {
                  throw new ConvexError('CUSTOMIZATION_GROUP_NOT_FOUND')
                }

                if (
                  customization.length < customizationConfig.minRequired ||
                  customization.length >
                    customizationConfig.minRequired +
                      customizationConfig.maxAdditional
                ) {
                  throw new Error('CUSTOMIZATION_LENGTH_INVALID')
                }

                const options = new Set(
                  customizationConfig.options.map((option) => option.name),
                )
                const selectedOptions = new Set(customization)
                if (!selectedOptions.isSubsetOf(options)) {
                  throw new Error('CUSTOMIZATION_OPTIONS_INVALID')
                }
              }

              return {
                ...orderItem,
                id: `${newOrderId}.${index + 1}`,
                price: calculateOrderItemPrice(
                  menuItem,
                  orderItem.customizations,
                ),
                ownerIds: orderItem.ownerIds,
                customizations: orderItem.customizations,
              }
            }),
          ),
        },
      ],
    })
  },
})

export const close = mutation({
  args: {
    tabId: v.id('tabs'),
  },
  handler: async (ctx, args) => {
    const tab = await ctx.db.get(args.tabId)
    if (!tab) {
      throw new ConvexError('TAB_NOT_FOUND')
    }

    if (tab.closedAt) {
      throw new ConvexError('TAB_CLOSED')
    }

    const closedTab = await ctx.db.patch(args.tabId, {
      closedAt: Date.now(),
    })

    await ctx.scheduler.runAfter(0, internal.tabs.deleteRoom, {
      tabId: args.tabId,
    })

    return closedTab
  },
})

export const deleteRoom = internalAction({
  args: {
    tabId: v.id('tabs'),
  },
  handler: async (ctx, args) => {
    await liveblocks.deleteRoom(args.tabId)
  },
})

export const pay = mutation({
  args: {
    tabId: v.id('tabs'),
    toBePaidOwnerIds: v.array(
      v.union(
        v.object({
          kind: v.literal('CustomerId'),
          value: v.string(),
        }),
        v.object({
          kind: v.literal('GuestId'),
          value: v.string(),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const tab = await ctx.db.get(args.tabId)
    if (!tab) {
      throw new ConvexError('TAB_NOT_FOUND')
    }

    if (!tab.closedAt) {
      throw new ConvexError('TAB_NOT_CLOSED')
    }

    const validOwnerIds = new Set()
    for (const order of tab.orders) {
      for (const orderItem of order.items) {
        for (const ownerId of orderItem.ownerIds) {
          validOwnerIds.add(convertDbToStrOwnerId(ownerId))
        }
      }
    }

    const toBePaidOwnerIds = args.toBePaidOwnerIds.map(convertDbToStrOwnerId)
    if (new Set(toBePaidOwnerIds).difference(validOwnerIds).size > 0) {
      throw new ConvexError('INVALID_OWNER_ID')
    }

    const paidOwnerIds = new Set([
      ...tab.paidOwnerIds.map(convertDbToStrOwnerId),
      ...toBePaidOwnerIds,
    ])

    return await ctx.db.patch(args.tabId, {
      paidOwnerIds: paidOwnerIds.values().map(convertStrToDbOwnerId).toArray(),
    })
  },
})

export const addOwner = mutation({
  args: {
    orderItemId: v.string(),
    ownerId: userId,
  },
  handler: async (ctx, args) => {
    const [tabId, scopedOrderId, scopedOrderItemId] = args.orderItemId.split(
      '.',
      3,
    )

    const normalizedTabId = ctx.db.normalizeId('tabs', tabId)
    if (!normalizedTabId) {
      throw new ConvexError('TAB_ID_INVALID')
    }

    const tab = await ctx.db.get(normalizedTabId)
    if (!tab) {
      throw new ConvexError('TAB_NOT_FOUND')
    }

    if (tab.closedAt) {
      throw new ConvexError('TAB_CLOSED')
    }

    switch (args.ownerId.kind) {
      case 'CustomerId':
        const tabVisitation = await ctx.db
          .query('tabVisitations')
          .withIndex('by_tab_id', (q) =>
            q.eq('tabId', normalizedTabId).eq('customerId', args.ownerId.value),
          )
          .first()
        if (!tabVisitation) {
          throw new ConvexError('OWNER_ID_INVALID')
        }
        break
      case 'GuestId':
        if (!tab.guestNames[args.ownerId.value]) {
          throw new ConvexError('OWNER_ID_INVALID')
        }
        break
    }

    const orderId = `${tabId}.${scopedOrderId}`
    const order = tab.orders.find(({ id }) => id === orderId)
    if (!order) {
      throw new ConvexError('ORDER_NOT_FOUND')
    }

    const orderItemId = `${orderId}.${scopedOrderItemId}`
    const orderItem = order.items.find(({ id }) => id === orderItemId)
    if (!orderItem) {
      throw new ConvexError('ORDER_ITEM_NOT_FOUND')
    }

    if (
      orderItem.ownerIds.some(
        ({ kind, value }) =>
          kind === args.ownerId.kind && value === args.ownerId.value,
      )
    ) {
      return
    }

    orderItem.ownerIds.push(args.ownerId)

    return await ctx.db.patch(normalizedTabId, {
      orders: tab.orders,
    })
  },
})

export const removeOwner = mutation({
  args: {
    orderItemId: v.string(),
    ownerId: userId,
  },
  handler: async (ctx, args) => {
    const [tabId, scopedOrderId, scopedOrderItemId] = args.orderItemId.split(
      '.',
      3,
    )

    const normalizedTabId = ctx.db.normalizeId('tabs', tabId)
    if (!normalizedTabId) {
      throw new ConvexError('TAB_ID_INVALID')
    }

    const tab = await ctx.db.get(normalizedTabId)
    if (!tab) {
      throw new ConvexError('TAB_NOT_FOUND')
    }

    if (tab.closedAt) {
      throw new ConvexError('TAB_CLOSED')
    }

    switch (args.ownerId.kind) {
      case 'CustomerId':
        const tabVisitation = await ctx.db
          .query('tabVisitations')
          .withIndex('by_tab_id', (q) =>
            q.eq('tabId', normalizedTabId).eq('customerId', args.ownerId.value),
          )
          .first()
        if (!tabVisitation) {
          throw new ConvexError('OWNER_ID_INVALID')
        }
        break
      case 'GuestId':
        if (!tab.guestNames[args.ownerId.value]) {
          throw new ConvexError('OWNER_ID_INVALID')
        }
        break
    }

    const orderId = `${tabId}.${scopedOrderId}`
    const order = tab.orders.find(({ id }) => id === orderId)
    if (!order) {
      throw new ConvexError('ORDER_NOT_FOUND')
    }

    const orderItemId = `${orderId}.${scopedOrderItemId}`
    const orderItem = order.items.find(({ id }) => id === orderItemId)
    if (!orderItem) {
      throw new ConvexError('ORDER_ITEM_NOT_FOUND')
    }

    const index = orderItem.ownerIds.findIndex(
      ({ kind, value }) =>
        kind === args.ownerId.kind && value === args.ownerId.value,
    )
    if (index === -1) {
      return
    }

    orderItem.ownerIds.splice(index, 1)
    await ctx.db.patch(normalizedTabId, {
      orders: tab.orders,
    })
  },
})

async function checkOwner(
  ctx: QueryCtx,
  tabId: Id<'tabs'>,
  ownerId: Infer<typeof userId>,
) {
  switch (ownerId.kind) {
    case 'CustomerId':
      const tabVisitation = await ctx.db
        .query('tabVisitations')
        .withIndex('by_tab_id', (q) =>
          q.eq('tabId', tabId).eq('customerId', ownerId.value),
        )
        .first()
      return Boolean(tabVisitation)
    case 'GuestId':
      const tab = await ctx.db.get(tabId)
      return Boolean(tab?.guestNames[ownerId.value])
  }
}

async function checkAuth(ctx: QueryCtx, tabId: Id<'tabs'>) {
  const tab = await ctx.db.get(tabId)
  if (!tab) {
    throw new ConvexError('TAB_NOT_FOUND')
  }

  const orderItems = tab.orders.flatMap((order) => order.items)

  const ownerIds = new Set(
    orderItems.flatMap((orderItem) => orderItem.ownerIds),
  )

  if (tab.closedAt && tab.paidOwnerIds.length === ownerIds.size) {
    if (Date.now() - tab.closedAt > 3 * 60 * 60 * 1000) {
      const identity = await ctx.auth.getUserIdentity()
      if (identity === null) {
        throw new ConvexError('NOT_AUTHENTICATED')
      }

      const visitation = await ctx.db
        .query('tabVisitations')
        .withIndex('by_customer_id', (q) =>
          q.eq('customerId', identity.subject),
        )
        .first()
      if (!visitation) {
        throw new ConvexError('NOT_AUTHORIZED')
      }

      throw new ConvexError('TAB_CLOSED')
    }
  }
}

function isTabFullyPaid({
  closedAt,
  orders,
  paidOwnerIds,
}: Pick<Doc<'tabs'>, 'closedAt' | 'orders' | 'paidOwnerIds'>) {
  const ownerIds = new Set(
    orders.flatMap((order) =>
      order.items.flatMap((orderItem) =>
        orderItem.ownerIds.map(convertDbToStrOwnerId),
      ),
    ),
  )

  return closedAt && paidOwnerIds.length >= ownerIds.size
}
