import { OrderStatus } from "@/types/apiRequest/order.request";

// Order-related response types

export interface OrderItem {
  item: string;
  variety: string;
  status: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  image: string;
  description: string;
  resolvedName: string;
}

export interface OrderTable {
  _id: string;
  name: string;
  resolvedName: string;
  link: string;
}

export interface BusinessOrder {
  _id: string;
  customer: string;
  orderNumber: number;
  amount: number;
  vat: number;
  paymentMethod: string;
  table: OrderTable;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  confirmedBy?: string | null;
  confirmedByAccount?: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
  } | null;
  deliveredAt?: string;
  deliveredBy?: string | null;
  deliveredByAccount?: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
  } | null;
}

export interface GetOrdersResponse {
  success: boolean;
  message: string;
  data: {
    docs: BusinessOrder[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UpdateOrderStatusResponse {
  success: boolean;
  message: string;
  data: BusinessOrder;
}
