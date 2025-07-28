'use client'

import React from 'react'
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Users 
} from 'lucide-react'
import DashboardWidget from './components/dashboard-widget'
import RevenueChart from './components/revenue-chart'
import FoodSalesPieChart from './components/food-sales-pie-chart'
import SatisfactionGauge from './components/satisfaction-gauge'
import AlertsPanel from './components/alerts-panel'
import { formatCurrency } from './data/revenue-data'

const DashboardLayout: React.FC = () => {
  // Mock data - replace with actual API calls
  const dashboardData = {
    totalRevenue: 12500000, // 12.5M NGN
    totalRevenueToday: 850000, // 850K NGN
    totalOrdersToday: 45,
    newCustomersToday: 12
  }



  return (
    <div className="space-y-6 mt-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardWidget
          title="Total Revenue"
          amount={formatCurrency(dashboardData.totalRevenue)}
          icon={DollarSign}
          subtext="All time revenue"
          trend={{ value: 12.5, isPositive: true }}
        />
        
        <DashboardWidget
          title="Revenue Today"
          amount={formatCurrency(dashboardData.totalRevenueToday)}
          icon={TrendingUp}
          subtext="Today's revenue"
          trend={{ value: 8.2, isPositive: true }}
        />
        
        <DashboardWidget
          title="Orders Today"
          amount={dashboardData.totalOrdersToday}
          icon={ShoppingCart}
          subtext="Orders received today"
          trend={{ value: 15.3, isPositive: true }}
        />
        
        <DashboardWidget
          title="New Customers"
          amount={dashboardData.newCustomersToday}
          icon={Users}
          subtext="New customers today"
          trend={{ value: 5.7, isPositive: true }}
        />
      </div>

      {/* Additional Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <FoodSalesPieChart />
        </div>
      </div>

      {/* Customer Satisfaction & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="md:col-span-2 lg:col-span-2">
          <SatisfactionGauge />
        </div>
        <div className="md:col-span-2 lg:col-span-2">
          <AlertsPanel />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
