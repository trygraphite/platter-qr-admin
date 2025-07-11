"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useMenuCategoryItems, useUpdateMenuItem } from "@/hooks/useMenu";
import { formatNaira } from "@/lib/utils";
import type {
  MenuCategory,
  MenuItem,
  MenuVariety,
} from "@/types/apiResponse/menu.payload";
import { AddMenuItemModal } from "../modals/add-menu-item-modal";
import { EditMenuItemModal } from "../modals/edit-menu-item-modal";

export interface MenuItemWithVarieties extends Omit<MenuItem, "varieties"> {
  varieties?: MenuVariety[];
}

interface MenuItemsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: MenuCategory;
  editMode: boolean;
}

export function MenuItemsDialog({
  isOpen,
  onClose,
  category,
  editMode,
}: MenuItemsDialogProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] =
    useState<MenuItemWithVarieties | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const { data: menuItemsData, refetch } = useMenuCategoryItems(category._id);
  const updateMenuItemMutation = useUpdateMenuItem();

  const menuItems: MenuItemWithVarieties[] = menuItemsData?.data?.docs || [];

  const toggleAvailability = async (item: MenuItemWithVarieties) => {
    try {
      // Get the group ID from the item (handle both string and object formats)
      const groupId = typeof item.group === "string" ? item.group : item.group?._id;

      await updateMenuItemMutation.mutateAsync({
        itemId: item._id,
        payload: {
          name: item.name,
          description: item.description,
          price: item.price,
          isAvailable: !item.isAvailable,
          image: item.image,
          servicePoint: item.servicePoint,
          category: item.category,
          group: groupId || "",
          varieties: item.varieties || [],
        },
      });

      // Show success message
      toast.success(`Availability updated`, {
        description: `${item.name} is now ${!item.isAvailable ? 'available' : 'unavailable'}`
      });

      // Refetch the data to update the UI
      refetch();
    } catch (error) {
      console.error("Error toggling availability:", error);
      toast.error("Failed to update availability", {
        description: "Please try again."
      });
    }
  };

  const toggleItemExpansion = (itemId: string) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(itemId)) {
      newExpandedItems.delete(itemId);
    } else {
      newExpandedItems.add(itemId);
    }
    setExpandedItems(newExpandedItems);
  };

  const itemHasVarieties = (item: MenuItemWithVarieties) => {
    return item.varieties && item.varieties.length > 1;
  };

  const getDisplayPrice = (item: MenuItemWithVarieties) => {
    if (itemHasVarieties(item)) {
      const availableVarieties = item.varieties!.filter((v) => v.isAvailable);
      if (availableVarieties.length === 0) {
        return "No available varieties";
      }

      const prices = availableVarieties.map((v) => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      if (minPrice === maxPrice) {
        return formatNaira(minPrice);
      } else {
        return `${formatNaira(minPrice)} - ${formatNaira(maxPrice)}`;
      }
    } else {
      return formatNaira(item.price);
    }
  };

  const getVarietyDisplayPrice = (variety: MenuVariety) => {
    return formatNaira(variety.price);
  };

  const getStockStatusColor = (isAvailable: boolean) => {
    return isAvailable
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="min-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {category.name} Menu Items
            </DialogTitle>
          </DialogHeader>

          <AddMenuItemModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            category={category}
          />

          {/* Only render EditMenuItemModal when editingMenuItem is not null */}
          {editingMenuItem && (
            <EditMenuItemModal
              isOpen={true}
              onClose={() => setEditingMenuItem(null)}
              menuItem={editingMenuItem}
              categoryId={category._id}
              groupId={typeof category.group === "string" ? category.group : category.group._id}
            />
          )}

          <div className="space-y-6 my-4">
            {!menuItems || menuItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No menu items in this category
              </div>
            ) : (
              menuItems.map((item) => {
                const hasVarieties = itemHasVarieties(item);

                return (
                  <div
                    key={item._id}
                    className={`border rounded-lg ${
                      !item.isAvailable ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    {!item.isAvailable && (
                      <div className="text-red-500 font-medium mb-2 text-sm px-4 pt-2">
                        Not Available
                      </div>
                    )}

                    {/* Main Item Display */}
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {item.image ? (
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className={`w-full md:w-28 h-28 rounded-lg object-cover transition-opacity duration-200 ${
                              !item.isAvailable ? "opacity-60" : ""
                            }`}
                          />
                        ) : (
                          <div className="w-full md:w-28 h-28 bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-muted-foreground text-sm">
                              No image
                            </span>
                          </div>
                        )}

                        <div className="flex-grow">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3
                                className={`font-semibold text-lg ${
                                  !item.isAvailable ? "text-gray-500" : ""
                                }`}
                              >
                                {item.name}
                              </h3>
                              <p
                                className={`text-sm ${
                                  !item.isAvailable
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                {item.description || "No description"}
                              </p>

                              {/* Varieties Count and Expand Button */}
                              {hasVarieties && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="secondary" className="text-white">
                                    {item.varieties && item.varieties.length > 1 ? item.varieties.length - 1 : 0} varieties
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      toggleItemExpansion(item._id)
                                    }
                                    className="p-1 h-6"
                                  >
                                    {expandedItems.has(item._id) ? (
                                      <ChevronUp className="w-4 h-4" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col items-end">
                              <span
                                className={`font-bold text-lg ${
                                  !item.isAvailable ? "text-gray-500" : ""
                                }`}
                              >
                                {getDisplayPrice(item)}
                              </span>
                              <div className="flex space-x-2 mt-2">
                                <div className="flex items-center space-x-2 mr-2">
                                  <Checkbox
                                    id={`available-dialog-${item._id}`}
                                    checked={item.isAvailable}
                                    onCheckedChange={() =>
                                      toggleAvailability(item)
                                    }
                                  />
                                  {editMode && (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          setEditingMenuItem(item)
                                        }
                                      >
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Edit
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        disabled
                                        onClick={() => {
                                          toast.info("Delete functionality coming soon!", {
                                            description: "Menu item deletion will be available in a future update."
                                          });
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Varieties View */}
                    {expandedItems.has(item._id) && hasVarieties && (
                      <div className="border-t bg-gray-50 p-4">
                        <h4 className="font-medium mb-3 text-gray-700">
                          Available Varieties:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {item.varieties && item.varieties.length > 1 && item.varieties.slice(1).map((variety) => (
                            <div
                              key={variety.name}
                              className={`p-3 rounded-lg border ${
                                variety.isAvailable
                                  ? "bg-white border-gray-200"
                                  : "bg-gray-100 border-gray-300"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`font-medium ${
                                        !variety.isAvailable
                                          ? "text-gray-500"
                                          : ""
                                      }`}
                                    >
                                      {variety.name}
                                    </span>
                                    {variety.isDefault && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        Default
                                      </Badge>
                                    )}
                                  </div>
                                  <p
                                    className={`text-sm ${
                                      !variety.isAvailable
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {variety.description || "No description"}
                                  </p>
                                  <span
                                    className={`font-semibold ${
                                      !variety.isAvailable
                                        ? "text-gray-500"
                                        : ""
                                    }`}
                                  >
                                    {getVarietyDisplayPrice(variety)}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Badge
                                    className={`text-xs ${getStockStatusColor(
                                      variety.isAvailable
                                    )}`}
                                  >
                                    {variety.isAvailable
                                      ? "Available"
                                      : "Unavailable"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="flex justify-between mt-4">
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center text-white"
              variant="secondary"
              size="sm"
            >
              Add Menu Item
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
