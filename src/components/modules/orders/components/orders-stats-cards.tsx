"use client";

import React, { useState, useEffect } from "react";
import { Clock, DollarSign, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessOrder } from "@/types/apiResponse/order.payload";
import { OrderStatus } from "@/types/apiRequest/order.request";
import { formatCurrency } from "@/utils/orders";

interface OrdersStatsCardsProps {
  orders: BusinessOrder[];
}

export const OrdersStatsCards: React.FC<OrdersStatsCardsProps> = ({ orders }) => {
  const [pendingCount, setPendingCount] = useState(0);
  const [preparingCount, setPreparingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const pendingOrdersCount = orders.filter(
    (o) => o.status === OrderStatus.PENDING
  ).length;
  const preparingOrdersCount = orders.filter(
    (o) => o.status === OrderStatus.PREPARING
  ).length;
  const completedOrdersCount = orders.filter(
    (o) => o.status === OrderStatus.COMPLETED
  ).length;

  // Calculate total revenue from only completed orders
  const totalRevenue = orders
    .filter((order) => order.status === OrderStatus.COMPLETED)
    .reduce((sum, order) => {
      const amount = typeof order.amount === 'number' ? order.amount : 
                    typeof order.amount === 'string' ? parseFloat(order.amount) : 0;
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

  // Animate counting from 0 to final values
  useEffect(() => {
    const duration = 1000; // 1 second animation
    const steps = 60; // 60 steps for smooth animation
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setPendingCount(Math.floor(pendingOrdersCount * progress));
      setPreparingCount(Math.floor(preparingOrdersCount * progress));
      setCompletedCount(Math.floor(completedOrdersCount * progress));
      setRevenue(Math.floor(totalRevenue * progress));

      if (currentStep >= steps) {
        // Set final values to ensure accuracy
        setPendingCount(pendingOrdersCount);
        setPreparingCount(preparingOrdersCount);
        setCompletedCount(completedOrdersCount);
        setRevenue(totalRevenue);
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [pendingOrdersCount, preparingOrdersCount, completedOrdersCount, totalRevenue]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Orders
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {pendingCount}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Preparing</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {preparingCount}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {completedCount}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {formatCurrency(revenue)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
