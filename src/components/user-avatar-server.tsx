import {
  convertStrToDbOwnerId,
  CustomerId,
  GuestId,
  OwnerId,
} from '@/lib/types'
import UserAvatar, { ErrorAvatar } from './user-avatar'
import { getCustomer, getGuest } from '@/lib/users'

export default function OwnerAvatar({ id }: { id: OwnerId }) {
  const { kind } = convertStrToDbOwnerId(id)
  return kind === 'CustomerId' ? (
    <CustomerAvatar id={id as CustomerId} />
  ) : (
    <GuestAvatar id={id as GuestId} />
  )
}

export async function CustomerAvatar({ id }: { id: CustomerId }) {
  let fullName: string
  let imageUrl: string
  try {
    const user = await getCustomer(id)
    fullName = user.fullName ?? id
    imageUrl = user.imageUrl
  } catch {
    return <ErrorAvatar />
  }
  return <UserAvatar photoPathinfo={imageUrl} name={fullName} />
}

export async function GuestAvatar({ id }: { id: GuestId }) {
  let name: string
  try {
    const guest = await getGuest(id)
    name = guest.name
  } catch {
    return <ErrorAvatar />
  }
  return <UserAvatar name={name} />
}
