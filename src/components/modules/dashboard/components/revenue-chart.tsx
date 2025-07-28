'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp } from 'lucide-react'
import { Chart } from '@/components/ui/chart'
import { revenueData, formatCurrency, type TimeFilter } from '../data/revenue-data'

const RevenueChart: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>('7days')

  const currentData = revenueData[selectedFilter]
  const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0)
  
  // Debug logging
  console.log('RevenueChart - currentData:', currentData)
  console.log('RevenueChart - selectedFilter:', selectedFilter)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Revenue Overview</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter Buttons */}
        <div className="flex space-x-2">
          <Button
            variant={selectedFilter === '7days' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('7days')}
          >
            7 Days
          </Button>
          <Button
            variant={selectedFilter === 'weeks' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('weeks')}
          >
            Weeks
          </Button>
          <Button
            variant={selectedFilter === 'months' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('months')}
          >
            Months
          </Button>
        </div>

        {/* Total Revenue Display */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
        </div>

        {/* Chart Visualization */}
        <div className="space-y-3">
          <Chart
            data={currentData}
            index="date"
            categories={["revenue"]}
            colors={["#72e3ad"]}
            valueFormatter={formatCurrency}
            type="line"
            showLegend={true}
            showTooltip={true}
            yAxisWidth={80}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default RevenueChart 