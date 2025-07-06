// Staff member data structure
export interface Staff {
  _id: string;
  firstName: string;
  lastName: string;
  designation: string;
  email: {
    value: string;
    verified: boolean;
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
  phone: string;
  status: 'active' | 'inactive';
  plainPassword: string;
  requiredPasswordChanged: boolean;
  identifier: string;
  resolvedName: string;
  type: 'waiter' | 'operator';
  [key: string]: unknown;
}

// Staff List Response
export interface StaffListResponse {
  data: {
    docs: Staff[];
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
  message: string;
  path: string;
  timestamp: string;
} 