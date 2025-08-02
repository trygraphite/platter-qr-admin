'use client'

import React from 'react'
import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Utensils } from 'lucide-react'

const foodSalesData = [
  { category: 'Main Dishes', sales: 45000, fill: '#72e3ad' },
  { category: 'Appetizers', sales: 28000, fill: '#3b82f6' },
  { category: 'Desserts', sales: 22000, fill: '#8b5cf6' },
  { category: 'Beverages', sales: 18000, fill: '#f59e0b' },
  { category: 'Sides', sales: 15000, fill: '#10b981' },
]

const COLORS = ['#72e3ad', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981']

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}



const FoodSalesPieChart: React.FC = () => {
  const totalSales = foodSalesData.reduce((sum, item) => sum + item.sales, 0)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Food Sales Distribution</CardTitle>
        <Utensils className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Sales Display */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Total Sales</p>
          <p className="text-2xl font-bold">{formatCurrency(totalSales)}</p>
        </div>

        {/* Pie Chart */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={foodSalesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }) => `${category} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="sales"
              >
                {foodSalesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex justify-center pt-4">
          <div className="grid grid-cols-3 gap-4">
            {foodSalesData.map((item, index) => (
              <div key={item.category} className="flex items-center space-x-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs text-muted-foreground">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FoodSalesPieChart 