'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  return <CreateTabButton />
}

function CreateTabButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/tabs', {
        method: 'POST',
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)

      const tabId = await res.text()
      if (!tabId) throw new Error('No id returned from server')

      router.push(`/tabs/${tabId}`)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(String(err))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button onClick={handleCreate} disabled={loading}>
        {loading ? 'Creating...' : 'Create Tab'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
