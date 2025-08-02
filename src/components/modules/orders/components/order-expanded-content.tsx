import React from "react";
import { BusinessOrder } from "@/types/apiResponse/order.payload";
import { formatCurrency } from "@/utils/orders";

interface OrderExpandedContentProps {
  order: BusinessOrder;
}

export const OrderExpandedContent: React.FC<OrderExpandedContentProps> = ({
  order,
}) => {
  return (
    <div className="p-3 sm:p-6 animate-in slide-in-from-top-2 duration-300 ease-out">
      <div className="bg-muted/50 rounded-lg border p-3 sm:p-4">
        <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-foreground">
          Order Items - ORD{order.orderNumber}
        </h4>
        <div className="space-y-2 sm:space-y-3">
          {order.items.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-background rounded-lg border"
            >
              <div className="flex-1 mb-2 sm:mb-0">
                <div className="flex items-start gap-3">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-foreground text-sm sm:text-base">
                      {item.name}
                    </h5>
                    {item.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center justify-between sm:justify-end gap-4 text-xs sm:text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Qty:</span> {item.quantity}
                  </div>
                  <div>
                    <span className="font-medium">Price:</span> {formatCurrency(item.price)}
                  </div>
                </div>
                <div className="text-base sm:text-lg font-semibold text-foreground text-right">
                  {formatCurrency(item.total)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
            <div className="text-xs sm:text-sm text-muted-foreground">
              <span className="font-medium">Payment Method:</span> {order.paymentMethod}
            </div>
            <div className="text-lg sm:text-xl font-bold text-foreground">
              Total: {formatCurrency(order.amount)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
