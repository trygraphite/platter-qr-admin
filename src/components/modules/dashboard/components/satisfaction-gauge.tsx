'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart } from 'lucide-react'
import { mockReviews } from '../data/mock-data'

const SatisfactionGauge: React.FC = () => {
  // Calculate average rating
  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length
  const percentage = (averageRating / 5) * 100

  // Color based on rating
  const getColor = (rating: number) => {
    if (rating >= 4.5) return '#10b981' // Green for excellent
    if (rating >= 4) return '#f59e0b'   // Yellow for good
    if (rating >= 3.5) return '#3b82f6' // Blue for average
    return '#ef4444'                    // Red for poor
  }

  const color = getColor(averageRating)

  // Get satisfaction level text
  const getSatisfactionLevel = (rating: number) => {
    if (rating >= 4.5) return 'Excellent'
    if (rating >= 4) return 'Good'
    if (rating >= 3.5) return 'Average'
    return 'Poor'
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Customer Satisfaction</CardTitle>
        <Heart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <div className="relative w-32 h-32">
          {/* Background circle */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={color}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 2.51} 251`}
              className="transition-all duration-1000 ease-in-out"
            />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold" style={{ color }}>
              {averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">out of 5</span>
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-sm font-medium">{getSatisfactionLevel(averageRating)}</p>
          <p className="text-xs text-muted-foreground">
            Based on {mockReviews.length} reviews
          </p>
        </div>

        {/* Rating breakdown */}
        <div className="w-full space-y-2">
          <p className="text-sm font-medium text-center">Rating Distribution</p>
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = mockReviews.filter(review => review.rating === rating).length
              const percentage = (count / mockReviews.length) * 100
              
              return (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-xs w-4">{rating}★</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getColor(rating)
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SatisfactionGauge 