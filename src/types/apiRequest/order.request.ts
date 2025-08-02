// Order-related request types

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  DELIVERED = "delivered",
  COMPLETED = "completed",
  PREPARING = "preparing",
  CANCELLED = "cancelled",
}

export interface GetOrdersRequest {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  status?: OrderStatus;
}

export interface UpdateOrderStatusRequest {
  order: string;
  status: OrderStatus;
}
