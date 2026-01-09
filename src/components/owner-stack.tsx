import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ReactNode } from 'react'

export default function OwnerStack({ children }: { children: ReactNode }) {
  return (
    <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
      {children}
    </div>
  )
}

export function AdditionalAvatar({ children }: { children: ReactNode }) {
  return (
    <Avatar>
      <AvatarFallback>{children}</AvatarFallback>
    </Avatar>
  )
}
