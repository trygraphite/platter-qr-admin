// Create Menu Group (POST)
export interface CreateMenuGroupRequest {
  name: string;
  description: string;
}

// Update Menu Group (PATCH)
export interface UpdateMenuGroupRequest {
  name: string;
  description: string;
}

// Create Menu Category (POST)
export interface CreateMenuCategoryRequest {
  name: string;
  description: string;
  group: string;
}

// Update Menu Category (PATCH)
export interface UpdateMenuCategoryRequest {
  name: string;
  description: string;
  group: string;
}

// Create Menu Item (POST)
export interface MenuVariety {
  name: string;
  description: string;
  image: string;
  isAvailable: boolean;
  isDefault: boolean;
  price: number;
  // id: string;
}

export interface CreateMenuItemRequest {
  servicePoint: string;
  category: string;
  group: string;
  name: string;
  description: string;
  image: string;
  isAvailable: boolean;
  price: number;
  varieties: MenuVariety[];
}

// Update Menu Item (PATCH)
export interface UpdateMenuItemRequest {
  servicePoint: string;
  category: string;
  group: string;
  name: string;
  description: string;
  image: string;
  isAvailable: boolean;
  price: number;
  varieties: MenuVariety[];
}

// Menu Item Variety (used in both create and update)
export interface MenuItemVariety {
  name: string;
  description: string;
  image: string;
  isAvailable: boolean;
  isDefault: boolean;
  price: number;
}
