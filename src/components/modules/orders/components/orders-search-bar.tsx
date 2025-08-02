import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface OrdersSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const OrdersSearchBar: React.FC<OrdersSearchBarProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="relative max-w-sm">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search orders, tables, or customers..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}; 