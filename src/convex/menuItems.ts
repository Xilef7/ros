import { ConvexError, v } from 'convex/values'
import { query } from './_generated/server'

export const get = query({
  args: {
    menuItemId: v.id('menuItems'),
  },
  handler: async (ctx, args) => {
    const menuItem = await ctx.db.get(args.menuItemId)
    if (!menuItem) {
      throw new ConvexError('MENU_ITEM_NOT_FOUND')
    }

    return {
      ...menuItem,
      photoPathinfo:
        menuItem.photoPathId &&
        ((await ctx.storage.getUrl(menuItem.photoPathId)) ?? undefined),
    }
  },
})
