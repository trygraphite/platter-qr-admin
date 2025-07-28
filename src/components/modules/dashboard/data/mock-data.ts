export interface Review {
  id: string
  customerName: string
  rating: number
  comment: string
  date: string
}

export const mockReviews: Review[] = [
  {
    id: '1',
    customerName: 'Sarah Johnson',
    rating: 5,
    comment: 'Excellent food and service! Will definitely come back.',
    date: '2024-01-15'
  },
  {
    id: '2',
    customerName: 'Michael Chen',
    rating: 4,
    comment: 'Great atmosphere and delicious food. Service was a bit slow.',
    date: '2024-01-14'
  },
  {
    id: '3',
    customerName: 'Emily Davis',
    rating: 5,
    comment: 'Amazing experience! The staff was very friendly.',
    date: '2024-01-13'
  },
  {
    id: '4',
    customerName: 'David Wilson',
    rating: 4,
    comment: 'Good food quality. Prices are reasonable.',
    date: '2024-01-12'
  },
  {
    id: '5',
    customerName: 'Lisa Brown',
    rating: 5,
    comment: 'Perfect dining experience. Highly recommended!',
    date: '2024-01-11'
  },
  {
    id: '6',
    customerName: 'James Miller',
    rating: 3,
    comment: 'Food was okay, but the wait time was too long.',
    date: '2024-01-10'
  },
  {
    id: '7',
    customerName: 'Maria Garcia',
    rating: 5,
    comment: 'Fantastic service and amazing food!',
    date: '2024-01-09'
  },
  {
    id: '8',
    customerName: 'Robert Taylor',
    rating: 4,
    comment: 'Very good food. Nice ambiance.',
    date: '2024-01-08'
  },
  {
    id: '9',
    customerName: 'Jennifer Lee',
    rating: 5,
    comment: 'Outstanding experience! Will visit again soon.',
    date: '2024-01-07'
  },
  {
    id: '10',
    customerName: 'Thomas Anderson',
    rating: 4,
    comment: 'Good food and service. Clean environment.',
    date: '2024-01-06'
  }
] 