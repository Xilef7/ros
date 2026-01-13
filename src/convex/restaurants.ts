import { ConvexError, v } from 'convex/values'
import { query, QueryCtx } from './_generated/server'
import { Id } from './_generated/dataModel'
import { paginationOptsValidator } from 'convex/server'

async function tryCatch<T>(fn: () => Promise<T>) {
  try {
    return await fn()
  } catch (error) {
    return { error: error instanceof ConvexError ? error.data : error }
  }
}

export const list = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query('restaurants')
      .paginate(args.paginationOpts)
    return {
      ...results,
      page: await Promise.all(
        results.page.map(async (restaurant) => ({
          ...restaurant,
          photoPathinfo:
            restaurant.photoPathId &&
            (await ctx.storage.getUrl(restaurant.photoPathId)),
        })),
      ),
    }
  },
})

export const get = query({
  args: {
    restaurantId: v.id('restaurants'),
  },
  handler: (ctx, args) =>
    tryCatch(async () => {
      const restaurant = await ctx.db.get(args.restaurantId)
      if (!restaurant) {
        throw new ConvexError('RESTAURANT_NOT_FOUND')
      }

      const menuItems = await getAvailableMenuItems(ctx, args.restaurantId)

      return {
        ...restaurant,
        photoPathinfo:
          restaurant.photoPathId &&
          (await ctx.storage.getUrl(restaurant.photoPathId)),
        menu: menuItems,
      }
    }),
})

export const listMenuItems = query({
  args: {
    restaurantId: v.id('restaurants'),
  },
  handler: (ctx, args) =>
    tryCatch(() => getAvailableMenuItems(ctx, args.restaurantId)),
})

export async function getAvailableMenuItems(
  ctx: QueryCtx,
  restaurantId: Id<'restaurants'>,
) {
  const restaurant = await ctx.db.get(restaurantId)
  if (!restaurant) {
    throw new ConvexError('RESTAURANT_NOT_FOUND')
  }

  const menuItems = (
    await Promise.all(
      restaurant.menu.map(async (menuItemId) => {
        const menuItem = await ctx.db.get(menuItemId)
        if (!menuItem) {
          return null
        }
        if (menuItem.deletedAt) {
          return null
        }
        return {
          ...menuItem,
          photoPathinfo:
            menuItem.photoPathId &&
            (await ctx.storage.getUrl(menuItem.photoPathId)),
        }
      }),
    )
  ).filter((menuItem) => menuItem !== null)

  return Object.fromEntries(
    menuItems.map((menuItem) => [menuItem._id, menuItem]),
  )
}
