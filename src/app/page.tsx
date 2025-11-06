import Link from 'next/link'
import CreateTab from './CreateTab'

export default function Home() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen p-4">
      <Link
        href="/scanner"
        className="w-full max-w-sm bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 text-center"
      >
        Scan QR Code
      </Link>
      <Link
        href="/restaurants"
        className="w-full max-w-sm bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 text-center"
      >
        Browse Restaurants
      </Link>
      <div className="flex gap-4 w-full max-w-sm">
        <Link
          href="/signup"
          className="flex-1 border border-orange-500 text-orange-500 py-2 px-4 rounded-lg hover:bg-orange-50 text-center"
        >
          Sign Up
        </Link>
        <Link
          href="/login"
          className="flex-1 border border-orange-500 text-orange-500 py-2 px-4 rounded-lg hover:bg-orange-50 text-center"
        >
          Login
        </Link>
      </div>
      <CreateTab />
    </div>
  )
}
