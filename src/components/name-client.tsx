'use client'

import { useGuestName } from '@/lib/hooks/convex'
import { useCustomerName } from '@/lib/hooks/user'
import {
  convertStrToDbOwnerId,
  CustomerId,
  GuestId,
  OwnerId,
} from '@/lib/types'

export function OwnerName({ id }: { id: OwnerId }) {
  return <TransformableOwnerName id={id} />
}

export function PossessiveOwnerName({ id }: { id: OwnerId }) {
  return (
    <TransformableOwnerName
      id={id}
      transform={(noun: string) => noun + "'" + (noun.endsWith('s') ? '' : 's')}
    />
  )
}

function TransformableOwnerName({
  id,
  transform,
}: {
  id: OwnerId
  transform?: (s: string) => string
}) {
  const { kind } = convertStrToDbOwnerId(id)
  switch (kind) {
    case 'CustomerId':
      return <CustomerName id={id as CustomerId} transform={transform} />
    case 'GuestId':
      return <GuestName id={id as GuestId} transform={transform} />
  }
}

function GuestName({
  id,
  transform,
}: {
  id: GuestId
  transform?: (s: string) => string
}) {
  const name = useGuestName(id) || id
  if (typeof name === 'object' && 'error' in name) {
    return id
  }
  return transform ? transform(name) : name
}

function CustomerName({
  id,
  transform,
}: {
  id: CustomerId
  transform?: (s: string) => string
}) {
  const name = useCustomerName(id) || id
  if (typeof name === 'object' && 'error' in name) {
    return id
  }
  return transform ? transform(name) : name
}
