'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            retry(failureCount) {
              if (failureCount === 1) return false
              return true
            },
          },
        },
      }),
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
