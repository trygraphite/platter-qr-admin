// Query params for list endpoints
export interface MenuListQuery {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  status?: string;
}

// Menu Group
export interface MenuGroup {
  _id: string;
  name: string;
  description: string;
}

export interface MenuGroupListResponse {
  path: string;
  message: string;
  timestamp: string;
  data: {
    docs: MenuGroup[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

// Menu Category
export interface MenuCategory {
  _id: string;
  name: string;
  description: string;
  group: string | MenuGroup;
}

export interface MenuCategoryListResponse {
  path: string;
  message: string;
  timestamp: string;
  data: {
    docs: MenuCategory[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

// Menu Item
export interface MenuVariety {
  name: string;
  description: string;
  image: string;
  isAvailable: boolean;
  isDefault: boolean;
  price: number;
}

export interface MenuItem {
  _id: string;
  servicePoint: string;
  category: string;
  group: string | MenuGroup;
  name: string;
  description: string;
  image: string;
  isAvailable: boolean;
  price: number;
  varieties: MenuVariety[];
}

export interface MenuItemListResponse {
  path: string;
  message: string;
  timestamp: string;
  data: {
    docs: MenuItem[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}
