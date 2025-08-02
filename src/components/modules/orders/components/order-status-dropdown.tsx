import React from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { OrderStatus } from "@/types/apiRequest/order.request";
import { getStatusColor, getStatusLabel, statusOrder } from "@/utils/orders";

interface OrderStatusDropdownProps {
  currentStatus: OrderStatus;
  onStatusChange: (newStatus: OrderStatus) => void;
}

export const OrderStatusDropdown: React.FC<OrderStatusDropdownProps> = ({
  currentStatus,
  onStatusChange,
}) => {
  const handleStatusChange = (newStatus: OrderStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    onStatusChange(newStatus);
  };

  return (
    <div className="flex items-center gap-2 p-2">
      <Badge
        className={getStatusColor(currentStatus)}
        variant="secondary"
      >
        {getStatusLabel(currentStatus)}
      </Badge>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => e.stopPropagation()}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {statusOrder.map((status) => (
            <DropdownMenuItem
              key={status}
              onClick={(e) => handleStatusChange(status, e)}
              className={currentStatus === status ? "bg-muted" : ""}
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(status).replace('bg-', 'bg-').replace(' text-', '')}`} />
                {getStatusLabel(status)}
                {currentStatus === status && (
                  <span className="text-xs text-muted-foreground">(Current)</span>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}; 