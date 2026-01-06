import Link from 'next/link'
import CreateTab from './CreateTab'
import { Button } from '@/components/ui/button'
import { ScanIcon, UtensilsIcon } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col gap-4 items-stretch justify-center min-h-screen p-4">
      <Button size="xl" asChild>
        <Link href="/scanner">
          <ScanIcon /> Scan QR Code
        </Link>
      </Button>
      <Button size="xl" asChild>
        <Link href="/restaurants">
          <UtensilsIcon /> Browse Restaurants
        </Link>
      </Button>
      <CreateTab />
    </div>
  )
}
