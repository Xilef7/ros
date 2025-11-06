import { MenuItemId, OwnerId, TmpOrderItemId } from '@/lib/types'
import { LiveList, LiveMap, LiveObject } from '@liveblocks/client'
import { UUID } from 'crypto'

declare global {
  interface Liveblocks {
    Storage: {
      currentOrder: LiveMap<
        TmpOrderItemId,
        LiveObject<{
          id: TmpOrderItemId
          quantity: number
          ownerIds: LiveList<OwnerId>
          menuItemId: MenuItemId
        }>
      >
    }

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: `${number}`
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
