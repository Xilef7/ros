import Image from 'next/image'
import { AspectRatio } from './ui/aspect-ratio'
import { ImageOffIcon } from 'lucide-react'
import { ReactNode } from 'react'

export default function Cover({
  photoPathinfo,
  name,
  children,
}: {
  photoPathinfo?: string
  name: string
  children: ReactNode
}) {
  return (
    <AspectRatio
      ratio={16 / 9}
      className="bg-gray-50 flex justify-center items-center"
    >
      {photoPathinfo ? (
        <Image src={photoPathinfo} alt={name} fill />
      ) : (
        <ImageOffIcon className="size-1/2" />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"></div>
      <div className="absolute bottom-4 left-4 right-4">{children}</div>
    </AspectRatio>
  )
}
