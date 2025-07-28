import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface DashboardWidgetProps {
  title: string
  amount: string | number
  icon: LucideIcon
  subtext: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  amount,
  icon: Icon,
  subtext,
  trend
}) => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold">
                {typeof amount === 'number' ? amount.toLocaleString() : amount}
              </p>
              {trend && (
                <span
                  className={`text-sm font-medium ${
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {subtext}
            </p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DashboardWidget 