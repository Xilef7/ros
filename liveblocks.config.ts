import { LiveOrderItem, LiveOrderItemId } from '@/lib/types'
import { LiveMap } from '@liveblocks/client'
import { UUID } from 'crypto'

declare global {
  interface Liveblocks {
    Storage: {
      currentOrder: LiveMap<LiveOrderItemId, LiveOrderItem>
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
