import { MenuItemId } from '@/lib/db/restaurant'
import { LiveList, LiveObject } from '@liveblocks/client'
import { UUID } from 'crypto'

declare global {
  interface Liveblocks {
    Storage: {
      currentOrder: LiveList<
        LiveObject<{
          id: string
          quantity: number
          guestOwnerIds: LiveList<string>
          customerOwnerIds: LiveList<UUID>
          menuItemId: MenuItemId
        }>
      >
    }

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string
      info: {
        name: string
        avatar?: string
      }
    }

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      tabId: UUID
      // Example, rooms with a title and url
      // title: string;
      // url: string;
    }
  }
}

export {}
