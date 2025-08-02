"use client";

import React from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BusinessOrder } from "@/types/apiResponse/order.payload";
import { formatCurrency } from "@/utils/orders";

interface PrintDocketDialogProps {
  order: BusinessOrder | null;
  open: boolean;
  onClose: () => void;
}

export const PrintDocketDialog: React.FC<PrintDocketDialogProps> = ({
  order,
  open,
  onClose
}) => {
  const handlePrint = () => {
    if (!order) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const docketContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Docket - ORD${order.orderNumber}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              max-width: 300px;
              margin: 0;
              padding: 10px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .order-info {
              margin-bottom: 15px;
            }
            .items {
              border-bottom: 1px solid #000;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            .total {
              font-weight: bold;
              font-size: 14px;
              text-align: right;
            }
            .footer {
              text-align: center;
              margin-top: 15px;
              font-size: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>RESTAURANT ORDER</h2>
            <p>Order #ORD${order.orderNumber}</p>
          </div>
          <div class="order-info">
            <p><strong>Table:</strong> ${order.table.name}</p>
            <p><strong>Time:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
          </div>
          <div class="items">
            <h3>Items:</h3>
            ${order.items.map(item => `
              <div class="item">
                <span>${item.quantity}x ${item.name}</span>
                <span>${formatCurrency(item.total)}</span>
              </div>
            `).join('')}
          </div>
          <div class="total">
            TOTAL: ${formatCurrency(order.amount)}
          </div>
          <div class="footer">
            <p>Thank you for your order!</p>
            <p>Printed: ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(docketContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    onClose();
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Print Order Docket
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="text-center font-mono text-sm space-y-2">
              <div className="font-bold text-lg">RESTAURANT ORDER</div>
              <div>Order #ORD{order.orderNumber}</div>
              <div className="border-t border-border pt-2 mt-3 text-left space-y-1">
                <div><strong>Table:</strong> {order.table.name}</div>
                <div><strong>Time:</strong> {new Date(order.createdAt).toLocaleString()}</div>
                <div><strong>Status:</strong> {order.status.toUpperCase()}</div>
              </div>
              <div className="border-t border-border pt-2 mt-3 text-left">
                <div className="font-bold mb-2">Items:</div>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-xs mb-1">
                    <span>{item.quantity}x {item.name}</span>
                    <span>{formatCurrency(item.total)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-2 mt-3 font-bold">
                TOTAL: {formatCurrency(order.amount)}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handlePrint} className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Print Docket
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 