import React from "react";
import { Printer, Eye, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BusinessOrder } from "@/types/apiResponse/order.payload";
import { OrderStatus } from "@/types/apiRequest/order.request";
import { OrderStatusDropdown } from "./order-status-dropdown";
import { OrderExpandedContent } from "./order-expanded-content";
import { formatCurrency, formatTimeAgo } from "@/utils/orders";

interface OrderTableRowProps {
  order: BusinessOrder;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onViewDetails: (order: BusinessOrder) => void;
  onPrintDocket: (order: BusinessOrder) => void;
}

export const OrderTableRow: React.FC<OrderTableRowProps> = ({
  order,
  isExpanded,
  onToggleExpansion,
  onStatusChange,
  onViewDetails,
  onPrintDocket,
}) => {
  return (
    <React.Fragment>
      <tr 
        className="border-b hover:bg-muted/50 cursor-pointer transition-colors duration-200"
        onClick={onToggleExpansion}
      >
        <td className="p-4 font-mono text-sm">
          <div className="flex items-center gap-2">
            <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : 'rotate-0'}`}>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
            ORD-{order.orderNumber}
          </div>
        </td>
        <td className="hidden md:table-cell p-4">Table-{order.table.name}</td>
        <td className="p-4">
          <div className="space-y-1">
            {order.items.slice(0, 2).map((item, index) => (
              <div key={index} className="text-sm">
                {item.quantity}x {item.name}
              </div>
            ))}
            {order.items.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{order.items.length - 2} more items
              </div>
            )}
          </div>
        </td>
        <td className="hidden md:table-cell p-4 text-sm">
          {formatTimeAgo(order.createdAt)}
        </td>
        <td className="p-4 font-semibold">
          {formatCurrency(order.amount)}
        </td>
        <td className="p-4">
          <OrderStatusDropdown
            currentStatus={order.status}
            onStatusChange={(newStatus) => onStatusChange(order._id, newStatus)}
          />
        </td>
        <td className="p-4">
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
        </td>
      </tr>
      {/* Expanded Row Content with Animation */}
      <tr className="border-b bg-muted/30">
        <td colSpan={7} className="p-0">
          <div 
            className={`overflow-hidden transition-all duration-300 ease-out ${
              isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <OrderExpandedContent order={order} />
          </div>
        </td>
      </tr>
    </React.Fragment>
  );
}; 