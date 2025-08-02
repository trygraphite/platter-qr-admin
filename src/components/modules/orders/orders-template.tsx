"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApi } from "@/network";
import { QUERY_KEYS } from "@/keys/query-keys";
import { BusinessOrder } from "@/types/apiResponse/order.payload";
import {
  OrderStatus,
  GetOrdersRequest,
  UpdateOrderStatusRequest,
} from "@/types/apiRequest/order.request";
import { OrdersTable } from "./components/orders-table";
import { PrintDocketDialog } from "./components/print-docket-dialog";
import {
  formatCurrency,
  formatTimeAgo,
  getStatusColor,
  getStatusLabel,
  statusOrder,
} from "@/utils/orders";

const OrdersTemplate: React.FC = () => {
  const { ordersApi } = useApi();
  const queryClient = useQueryClient();

  // State for order details modal
  const [selectedOrder, setSelectedOrder] = useState<BusinessOrder | null>(
    null
  );
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  // Fetch all orders for stats (without pagination)
  const { data: allOrdersResponse } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_ORDERS, "all"],
    queryFn: async () => {
      const params: GetOrdersRequest = {
        page: 1,
        limit: 50, // Large limit to get all orders
      };
      return await ordersApi.getAllOrders(params);
    },
  });

  // Fetch paginated orders data
  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_ORDERS, "paginated"],
    queryFn: async () => {
      const params: GetOrdersRequest = {
        page: 1,
        limit: 50,
      };
      return await ordersApi.getAllOrders(params);
    },
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (payload: UpdateOrderStatusRequest) => {
      const response = await ordersApi.updateOrderStatus(payload);
      return response.data;
    },
    onSuccess: (updatedOrder) => {
      toast.success(`Order status updated to ${updatedOrder.status}`);
      setShowOrderDetails(false);
      setSelectedOrder(null);
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_ORDERS] });
    },
    onError: (error) => {
      toast.error("Failed to update order status");
      console.error("Update order status error:", error);
    },
  });

  const orders = ordersData?.data?.docs || [];
  const totalItems = ordersData?.data?.totalItems || 0;
  const allOrders = allOrdersResponse?.data?.docs || [];

  // Debug: Log the first order to see the structure
  if (orders.length > 0) {
    console.log("First order structure:", orders[0]);
    console.log("Amount type:", typeof orders[0].amount);
    console.log("Amount value:", orders[0].amount);
  }

  const handleViewOrder = (order: BusinessOrder) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handlePrintDocket = (order: BusinessOrder) => {
    setSelectedOrder(order);
    setShowPrintDialog(true);
  };

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateStatusMutation.mutate({
      order: orderId,
      status: newStatus,
    });
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">Failed to load orders</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track all restaurant orders
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {totalItems} Orders
          </Badge>
        </div>
      </div>

      {/* New Orders Table Component */}
      <OrdersTable
        orders={allOrders}
        onStatusChange={handleStatusUpdate}
        onViewDetails={handleViewOrder}
        onPrintDocket={handlePrintDocket}
        isLoading={isLoading}
      />

      {/* Order Details Dialog */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Order Details - #{selectedOrder?.orderNumber}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-medium">ORD{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Table</p>
                  <p className="font-medium">{selectedOrder.table.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Time</p>
                  <p className="font-medium">{formatTimeAgo(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-medium">
                    {formatCurrency(selectedOrder.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {getStatusLabel(selectedOrder.status)}
                  </Badge>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium mb-3">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b last:border-b-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(item.total)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <p className="text-lg font-semibold">Total</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(selectedOrder.amount)}
                  </p>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h4 className="font-medium mb-3">Update Status</h4>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-muted-foreground min-w-[80px]">
                    Status:
                  </label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value: OrderStatus) =>
                      handleStatusUpdate(selectedOrder._id, value)
                    }
                    disabled={updateStatusMutation.isPending}
                  >
                    <SelectTrigger className="w-[200px] border-primary focus:ring-primary focus:ring-2">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOrder.map((status) => (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusColor(
                                status
                              )
                                .replace("bg-", "bg-")
                                .replace(" text-", "")}`}
                            />
                            {getStatusLabel(status)}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {updateStatusMutation.isPending && (
                    <p className="text-sm text-muted-foreground">
                      Updating status...
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Print Docket Dialog */}
      <PrintDocketDialog
        order={selectedOrder}
        open={showPrintDialog}
        onClose={() => setShowPrintDialog(false)}
      />
    </div>
  );
};

export default OrdersTemplate;
