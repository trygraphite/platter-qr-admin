export interface Variety {
    id: string
    name: string
    price: number
    options: string[]
    stockStatus: "in-stock" | "out-of-stock" | "low-stock"
    createdAt: string
    updatedAt: string
  }
  
  export interface MenuItem {
    id: string
    name: string
    price: number
    description?: string
    thumbnail?: string
    varieties: Variety[]
    categoryId: string
    createdAt: string
    updatedAt: string
  }
  
  export interface Category {
    id: string
    name: string
    description?: string
    menuItems: MenuItem[]
    categoryGroupId: string
    createdAt: string
    updatedAt: string
  }
  
  export interface CategoryGroup {
    id: string
    name: string
    description?: string
    categories: Category[]
    createdAt: string
    updatedAt: string
  }
  
  export interface User {
    id: string
    name: string
    email: string
    avatar?: string
  }
  
  export interface QRCodeResponse {
    qrCodeUrl: string
    menuUrl: string
  }
  