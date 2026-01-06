import {
  convertStrToDbOwnerId,
  CustomerId,
  GuestId,
  OwnerId,
} from '@/lib/types'
import { getCustomer, getGuest } from '@/lib/users'

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

async function GuestName({
  id,
  transform,
}: {
  id: GuestId
  transform?: (s: string) => string
}) {
  const guest = await getGuest(id)
  const name = guest.name || id
  if (typeof name === 'object' && 'error' in name) {
    return id
  }
  return transform ? transform(name) : name
}

async function CustomerName({
  id,
  transform,
}: {
  id: CustomerId
  transform?: (s: string) => string
}) {
  const customer = await getCustomer(id)
  const name = customer.fullName || id
  if (typeof name === 'object' && 'error' in name) {
    return id
  }
  return transform ? transform(name) : name
}
