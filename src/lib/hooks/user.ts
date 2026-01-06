import { useSuspenseQuery } from '@tanstack/react-query'
import { CustomerId, OwnerId, TabId } from '@/lib/types'
import { useUser } from '@clerk/nextjs'
import { useParams } from 'next/navigation'
import { useSyncExternalStore } from 'react'
import { User } from '@clerk/nextjs/server'

function makeCustomerQueryOptions(id: CustomerId) {
  return {
    queryKey: ['user', id],
    queryFn: () =>
      fetch(`/api/users/${id}`).then((res) => res.json() as Promise<User>),
  }
}

export function useCustomerSuspenseQuery(id: CustomerId) {
  return useSuspenseQuery(makeCustomerQueryOptions(id))
}

export function useMyGuestId() {
  const { tabId } = useParams<{ tabId: TabId | undefined }>()

  const key = `${tabId}:my_guest_id`

  return [
    useSyncExternalStore(
      (onStoreChange) => {
        if (!tabId) {
          return () => {}
        }

        const listener = (event: StorageEvent) => {
          if (event.storageArea === localStorage && event.key === key) {
            onStoreChange()
          }
        }
        window.addEventListener('storage', listener)
        return () => {
          window.removeEventListener('storage', listener)
        }
      },
      () => localStorage.getItem(key),
      () => undefined,
    ),
    (guestId: string) => {
      localStorage.setItem(key, guestId)
      window.dispatchEvent(
        new StorageEvent('storage', {
          key,
          storageArea: localStorage,
        }),
      )
    },
  ] as [string | null | undefined, (guestId: string) => void]
}

export function useMyOwnerId() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [guestId] = useMyGuestId()
  let myOwnerId: OwnerId | null | undefined
  if (isLoaded) {
    if (isSignedIn) {
      myOwnerId = `CustomerId.${user.id}`
    } else {
      if (guestId) {
        myOwnerId = `GuestId.${guestId}`
      } else {
        myOwnerId = null
      }
    }
  }

  return {
    isLoaded,
    myOwnerId,
  }
}

export function useCustomerName(id: CustomerId) {
  return useCustomerSuspenseQuery(id).data.fullName
}
