'use client'

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const BusinessSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      {/* Header Skeleton */}
      <Skeleton className="h-8 w-48 mb-6" />
      
      {/* Business Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="border rounded-lg p-6 flex flex-col items-center"
          >
            {/* Business Logo Skeleton */}
            <Skeleton className="w-15 h-15 rounded-full mb-4" />
            
            {/* Business Name Skeleton */}
            <Skeleton className="h-6 w-32 mb-2" />
            
            {/* Primary Badge Skeleton */}
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default BusinessSkeleton