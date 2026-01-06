'use client'

import { ClerkProvider } from '@clerk/nextjs'
import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from '@tanstack/react-query'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import * as React from 'react'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (isServer) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export default function Providers(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <ClerkProvider>
      <ConvexProvider client={convex}>
        <QueryClientProvider client={queryClient}>
          {props.children}
        </QueryClientProvider>
      </ConvexProvider>
    </ClerkProvider>
  )
}
