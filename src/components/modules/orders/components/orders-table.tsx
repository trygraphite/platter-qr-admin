"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessOrder } from "@/types/apiResponse/order.payload";
import { OrderStatus } from "@/types/apiRequest/order.request";
import { OrdersStatsCards } from "./orders-stats-cards";
import { OrdersSearchBar } from "./orders-search-bar";
import { OrderTableRow } from "./order-table-row";
import { OrderCard } from "./order-card";
import { OrdersTableSkeleton } from "./orders-table-skeleton";

interface OrdersTableProps {
  orders: BusinessOrder[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onViewDetails: (order: BusinessOrder) => void;
  onPrintDocket: (order: BusinessOrder) => void;
  isLoading?: boolean;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onStatusChange,
  onViewDetails,
  onPrintDocket,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const filteredOrders = orders.filter(
    (order) =>
      String(order.orderNumber)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRowExpansion = (orderId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(orderId)) {
      newExpandedRows.delete(orderId);
    } else {
      newExpandedRows.add(orderId);
    }
    setExpandedRows(newExpandedRows);
  };

  const isRowExpanded = (orderId: string) => expandedRows.has(orderId);

  if (isLoading) {
    return <OrdersTableSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <OrdersStatsCards orders={orders} />

      {/* Search Bar */}
      <OrdersSearchBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Order ID
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Table
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Menu Items
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Order Time
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Total
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left p-4 font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <OrderTableRow
                      key={order._id}
                      order={order}
                      isExpanded={isRowExpanded(order._id)}
                      onToggleExpansion={() => toggleRowExpansion(order._id)}
                      onStatusChange={onStatusChange}
                      onViewDetails={onViewDetails}
                      onPrintDocket={onPrintDocket}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  isExpanded={isRowExpanded(order._id)}
                  onToggleExpansion={() => toggleRowExpansion(order._id)}
                  onStatusChange={onStatusChange}
                  onViewDetails={onViewDetails}
                  onPrintDocket={onPrintDocket}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
