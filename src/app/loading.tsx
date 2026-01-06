import { Spinner } from '@/components/ui/spinner'

export default async function Loading() {
  return (
    <Spinner className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-16 text-primary" />
  )
}
