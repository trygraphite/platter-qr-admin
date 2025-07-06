// Business Table List Query Params
export interface GetBusinessTablesQuery {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  status?: string;
}

// Service Point List Query Params
export interface GetServicePointsQuery {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  string?: string;
}

export interface BusinessTable {
  _id: string;
  name: string;
  link: string;
  business: {
    _id: string;
    name: string;
    logo: string;
    image: string;
  };
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: {
      value: string;
    };
  };
}

export interface ServicePoint {
  _id: string;
  name: string;
  description: string;
}

export interface BusinessTableListResponse {
  data: {
    docs: BusinessTable[];
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
  message: string;
  path: string;
  timestamp: string;
}

export interface ServicePointListResponse {
  data: {
    docs: ServicePoint[];
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
  message: string;
  path: string;
  timestamp: string;
}
