'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, MessageSquare, Bell } from 'lucide-react'

const AlertsPanel: React.FC = () => {
  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Low Stock Alert',
      message: 'Mozzarella cheese running low',
      time: '5 min ago',
      icon: AlertTriangle
    },
    {
      id: 2,
      type: 'error',
      title: 'Long Pending Order',
      message: 'Table 8 order pending for 35 min',
      time: '10 min ago',
      icon: Clock
    },
    {
      id: 3,
      type: 'info',
      title: 'Customer Complaint',
      message: 'Negative review needs attention',
      time: '1 hour ago',
      icon: MessageSquare
    },
    {
      id: 4,
      type: 'info',
      title: 'System Update',
      message: 'New menu items added',
      time: '2 hours ago',
      icon: Bell
    }
  ]

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-warning text-warning-foreground'
      case 'error': return 'bg-destructive text-destructive-foreground'
      case 'info': return 'bg-info text-info-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Alerts & Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg border">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getAlertColor(alert.type)}`}>
              <alert.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{alert.title}</p>
              <p className="text-sm text-muted-foreground">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
            </div>
            <Button size="sm" variant="outline">
              View
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default AlertsPanel 