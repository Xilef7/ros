import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CircleAlertIcon } from 'lucide-react'
import { CSSProperties } from 'react'

export default function UserAvatar({
  photoPathinfo,
  name,
  fallbackHue,
}: {
  photoPathinfo?: string
  name: string | undefined
  fallbackHue?: number
}) {
  if (fallbackHue === undefined) {
    fallbackHue = name ? generateHash(name) : 0
  }
  return (
    <Avatar>
      <AvatarImage src={photoPathinfo} alt={name} />
      {name ? (
        <AvatarFallback
          style={{ '--avatarFallbackHue': fallbackHue } as CSSProperties}
          className={`bg-[hsl(var(--avatarFallbackHue),86%,86%)] text-black`}
        >
          {name
            .split(' ')
            .filter(Boolean)
            .map(([initial]) => initial.toUpperCase())
            .join('')}
        </AvatarFallback>
      ) : (
        <AvatarFallback className="bg-accent animate-pulse" />
      )}
    </Avatar>
  )
}

export function ErrorAvatar() {
  return (
    <Avatar>
      <AvatarFallback>
        <CircleAlertIcon />
      </AvatarFallback>
    </Avatar>
  )
}

function generateHash(string: string) {
  let hash = 0
  for (const char of string) {
    hash = (hash << 5) - hash + char.charCodeAt(0)
    hash |= 0
  }
  return hash
}
