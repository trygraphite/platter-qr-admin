// Create Staff (POST)
export interface CreateStaffRequest {
  firstName: string;
  lastName: string;
  email: string;
  designation: string;
  phone: string;
  type: 'waiter' | 'operator';
}

// Get Staff List Query Params (GET)
export interface GetStaffQuery {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  status?: string;
} 