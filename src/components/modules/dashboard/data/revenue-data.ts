export interface RevenueData {
  date: string
  revenue: number
}

export type TimeFilter = '7days' | 'weeks' | 'months'

export const revenueData: Record<TimeFilter, RevenueData[]> = {
  '7days': [
    { date: 'Mon', revenue: 45000 },
    { date: 'Tue', revenue: 52000 },
    { date: 'Wed', revenue: 48000 },
    { date: 'Thu', revenue: 61000 },
    { date: 'Fri', revenue: 75000 },
    { date: 'Sat', revenue: 89000 },
    { date: 'Sun', revenue: 68000 },
  ],
  'weeks': [
    { date: 'Week 1', revenue: 320000 },
    { date: 'Week 2', revenue: 380000 },
    { date: 'Week 3', revenue: 420000 },
    { date: 'Week 4', revenue: 450000 },
  ],
  'months': [
    { date: 'Jan', revenue: 1200000 },
    { date: 'Feb', revenue: 1350000 },
    { date: 'Mar', revenue: 1420000 },
    { date: 'Apr', revenue: 1580000 },
    { date: 'May', revenue: 1650000 },
    { date: 'Jun', revenue: 1720000 },
  ],
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
} 