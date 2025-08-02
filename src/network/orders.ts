import { AxiosInstance } from "axios";
import {
  GetOrdersRequest,
  UpdateOrderStatusRequest,
} from "@/types/apiRequest/order.request";
import {
  GetOrdersResponse,
  UpdateOrderStatusResponse,
} from "@/types/apiResponse/order.payload";

// API functions
export const ordersApi = (platterApi: AxiosInstance) => ({
  // Get all business orders with pagination, sorting, search, and status filtering
  getAllOrders: async (
    params: GetOrdersRequest = {}
  ): Promise<GetOrdersResponse> => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.search) queryParams.append("search", params.search);
    if (params.status) queryParams.append("status", params.status);

    const response = await platterApi.get(
      `/business/order?${queryParams.toString()}`
    );
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (
    payload: UpdateOrderStatusRequest
  ): Promise<UpdateOrderStatusResponse> => {
    const response = await platterApi.post("/order/status", payload);
    return response.data;
  },
});
