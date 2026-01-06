'use client'

import {
  convertStrToDbOwnerId,
  CustomerId,
  GuestId,
  OwnerId,
} from '@/lib/types'
import UserAvatar, { ErrorAvatar } from './user-avatar'
import { useCustomerSuspenseQuery } from '@/lib/hooks/user'
import { useGuestName } from '@/lib/hooks/convex'

export default function OwnerAvatar({ id }: { id: OwnerId }) {
  const { kind } = convertStrToDbOwnerId(id)
  return kind === 'CustomerId' ? (
    <CustomerAvatar id={id as CustomerId} />
  ) : (
    <GuestAvatar id={id as GuestId} />
  )
}

export function CustomerAvatar({ id }: { id: CustomerId }) {
  const {
    data: { fullName, imageUrl },
    error,
  } = useCustomerSuspenseQuery(id)
  if (error) {
    return <ErrorAvatar />
  }
  return <UserAvatar photoPathinfo={imageUrl} name={fullName ?? undefined} />
}

export function GuestAvatar({ id }: { id: GuestId }) {
  const name = useGuestName(id)
  if (typeof name === 'object' && 'error' in name) {
    return <ErrorAvatar />
  }
  return <UserAvatar name={name} />
}
