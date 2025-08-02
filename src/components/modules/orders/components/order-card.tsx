import React from "react";
import { Printer, Eye, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BusinessOrder } from "@/types/apiResponse/order.payload";
import { OrderStatus } from "@/types/apiRequest/order.request";
import { OrderStatusDropdown } from "./order-status-dropdown";
import { OrderExpandedContent } from "./order-expanded-content";
import { formatCurrency, formatTimeAgo } from "@/utils/orders";

interface OrderCardProps {
  order: BusinessOrder;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onViewDetails: (order: BusinessOrder) => void;
  onPrintDocket: (order: BusinessOrder) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  isExpanded,
  onToggleExpansion,
  onStatusChange,
  onViewDetails,
  onPrintDocket,
}) => {
  return (
    <Card className="w-full">
      <CardHeader 
        className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors duration-200"
        onClick={onToggleExpansion}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : 'rotate-0'}`}>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">ORD{order.orderNumber}</h3>
              <p className="text-sm text-muted-foreground">Table {order.table.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">{formatCurrency(order.amount)}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
              <Clock className="h-3 w-3" />
              {formatTimeAgo(order.createdAt)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Menu Items Preview */}
        <div className="mb-4">
          <div className="space-y-1">
            {order.items.slice(0, 2).map((item, index) => (
              <div key={index} className="text-sm flex justify-between">
                <span>{item.quantity}x {item.name}</span>
                <span className="text-muted-foreground">{formatCurrency(item.total)}</span>
              </div>
            ))}
            {order.items.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{order.items.length - 2} more items
              </div>
            )}
          </div>
        </div>

        {/* Status and Actions */}
        <div className="flex items-center justify-between">
          <OrderStatusDropdown
            currentStatus={order.status}
            onStatusChange={(newStatus) => onStatusChange(order._id, newStatus)}
          />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(order);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onPrintDocket(order);
              }}
            >
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Expanded Content with Animation */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-out ${
            isExpanded ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-4 border-t">
            <OrderExpandedContent order={order} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 