'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateTab() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [restaurantId, setRestaurantId] = useState('') // new state for input

  const createTab = async () => {
    if (!restaurantId) {
      alert('Please enter a restaurant ID')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/tabs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error('Failed to create tab')
      }

      const data = await res.json()
      const { uuid } = data

      router.push(`/tabs/${uuid}`)
    } catch (error) {
      console.error(error)
      alert('Error creating tab')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="text"
        placeholder="Enter restaurant ID"
        value={restaurantId}
        onChange={(e) => setRestaurantId(e.target.value)}
        className="w-full max-w-sm border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <button
        onClick={createTab}
        disabled={loading}
        className="w-full max-w-sm bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 text-center disabled:opacity-50"
      >
        {loading ? 'Creating Tab...' : 'Create Tab'}
      </button>
    </div>
  )
}
