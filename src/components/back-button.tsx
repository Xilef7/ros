'use client'

import { ArrowLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BackButton({ route }: { route?: string }) {
  const router = useRouter()
  return (
    <ArrowLeftIcon
      onClick={() => (route ? router.replace(route) : router.back())}
    />
  )
}
