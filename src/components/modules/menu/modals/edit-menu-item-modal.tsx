"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useUpdateMenuItem } from "@/hooks/useMenu";
import { useServicePoints } from "@/hooks/useServicePoints";
import { ImageUploader } from "@/components/custom/image-uploader";
import { useApi } from "@/network";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { MenuItem, MenuVariety } from "@/types/apiResponse/menu.payload";

interface MenuItemVariety {
  _id?: string;
  name: string;
  price: string;
  description: string;
}

interface EditMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItemWithVarieties;
  categoryId: string;
  groupId: string;
}

export interface MenuItemWithVarieties extends Omit<MenuItem, "varieties"> {
  varieties?: MenuVariety[];
}

export function EditMenuItemModal({
  isOpen,
  onClose,
  menuItem,
  categoryId,
  groupId,
}: EditMenuItemModalProps) {
  const [name, setName] = useState(menuItem.name);
  const [description, setDescription] = useState(menuItem.description || "");
  const [price, setPrice] = useState(menuItem.price.toString());
  const [isAvailable, setIsAvailable] = useState(menuItem.isAvailable);
  const [imagePreview, setImagePreview] = useState<string | null>(
    menuItem.image || null
  );
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(
    menuItem.image || ""
  );
  const [varieties, setVarieties] = useState<MenuItemVariety[]>([]);
  const [selectedServicePoint, setSelectedServicePoint] = useState<string>(
    menuItem.servicePoint || ""
  );

  const { uploadApi } = useApi();
  const updateMenuItemMutation = useUpdateMenuItem();
  const { data: servicePointsData, isLoading: servicePointsLoading } =
    useServicePoints();
  const servicePoints = servicePointsData?.data?.docs || [];

  // Initialize varieties from menuItem
  useEffect(() => {
    if (menuItem.varieties && menuItem.varieties.length > 0) {
      const convertedVarieties: MenuItemVariety[] = menuItem.varieties.map(
        (variety) => ({
          _id: variety._id,
          name: variety.name,
          price: variety.price.toString(),
          description: variety.description || "",
          stockStatus: variety.isAvailable ? "in-stock" : "out-of-stock",
        })
      );
      setVarieties(convertedVarieties);
    }
  }, [menuItem]);

  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => uploadApi.uploadImage(file),
    onSuccess: (response) => {
      const imageUrl = response.data.data.url;
      setUploadedImageUrl(imageUrl);
      setImagePreview(imageUrl);
      toast.success("Image uploaded successfully!");
    },
    onError: (error) => {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image", {
        description: "Please try again.",
      });
    },
  });

  const handleImageChange = async (file: File) => {
    uploadImageMutation.mutate(file);
  };

  const addVariety = () => {
    const newVariety: MenuItemVariety = {
      name: "",
      price: "",
      description: "",
    };
    setVarieties([...varieties, newVariety]);
  };

  const removeVariety = (index: number) => {
    setVarieties(varieties.filter((_, i) => i !== index));
  };

  const updateVariety = (
    index: number,
    field: keyof MenuItemVariety,
    value: string
  ) => {
    const updatedVarieties = varieties.map((variety, i) =>
      i === index ? { ...variety, [field]: value } : variety
    );
    setVarieties(updatedVarieties);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedServicePoint) {
      toast.error("Service point required", {
        description: "Please select a service point",
      });
      return;
    }

    try {
      let preparedVarieties: Array<{
        _id?: string;
        name: string;
        price: number;
        description: string;
        image: string;
        isAvailable: boolean;
        isDefault: boolean;
      }> = [];

      // If custom varieties exist, use them
      if (varieties.length > 0) {
        preparedVarieties = varieties.map((variety, index) => ({
          _id: variety._id,
          name: variety.name,
          price: Number.parseFloat(variety.price),
          description: variety.description || "",
          image: uploadedImageUrl || "",
          isAvailable: true,
          isDefault: index === 0, // First custom variety is the default
        }));
      }

      const menuItemData = {
        name,
        description,
        price: Number.parseFloat(price),
        isAvailable,
        image: uploadedImageUrl,
        servicePoint: selectedServicePoint,
        category: categoryId,
        group: groupId,
        varieties: preparedVarieties,
      };

      await updateMenuItemMutation.mutateAsync({
        itemId: menuItem._id,
        payload: menuItemData,
      });

      // Show success message
      toast.success("Menu item updated successfully!", {
        description: `${name} has been updated`,
      });

      onClose();
    } catch (error) {
      console.error("Error updating menu item:", error);
      toast.error("Failed to update menu item", {
        description: "Please check your information and try again.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="price">Base Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="servicePoint">Service Point</Label>
            <Select
              value={selectedServicePoint}
              onValueChange={setSelectedServicePoint}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a service point" />
              </SelectTrigger>
              <SelectContent>
                {servicePointsLoading ? (
                  <SelectItem value="" disabled>
                    Loading service points...
                  </SelectItem>
                ) : servicePoints.length === 0 ? (
                  <SelectItem value="" disabled>
                    No service points available
                  </SelectItem>
                ) : (
                  servicePoints.map((servicePoint) => (
                    <SelectItem key={servicePoint._id} value={servicePoint._id}>
                      {servicePoint.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <ImageUploader
              title="Upload Image"
              caption="16:9 landscape format recommended"
              imageUrl={imagePreview || undefined}
              onFileChange={handleImageChange}
              disabled={uploadImageMutation.isPending}
            />
            {uploadImageMutation.isPending && (
              <p className="text-sm text-muted-foreground mt-1">
                Uploading image...
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAvailable"
              checked={isAvailable}
              onCheckedChange={(checked) => setIsAvailable(checked === true)}
            />
            <Label htmlFor="isAvailable">Available</Label>
          </div>

          {/* Varieties Section - Only show if user has added custom varieties */}
          {varieties.length > 1 ? (
            <div className="space-y-4">
              {varieties.slice(1).map((variety, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Variety {index + 2}</span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeVariety(index + 1)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`variety-name-${index + 1}`}>Name</Label>
                      <Input
                        id={`variety-name-${index + 1}`}
                        value={variety.name}
                        onChange={(e) => updateVariety(index + 1, "name", e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                          }
                        }}
                        placeholder="e.g., Small, Medium, Large"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`variety-price-${index + 1}`}>Price</Label>
                      <Input
                        id={`variety-price-${index + 1}`}
                        type="number"
                        step="0.01"
                        value={variety.price}
                        onChange={(e) => updateVariety(index + 1, "price", e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                          }
                        }}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`variety-description-${index + 1}`}>Description</Label>
                      <Input
                        id={`variety-description-${index + 1}`}
                        value={variety.description}
                        onChange={(e) => updateVariety(index + 1, "description", e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                          }
                        }}
                        placeholder="Variety description"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Varieties (Optional)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVariety}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variety
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                No varieties added. Add varieties if this item has different sizes, options, or prices.
              </p>
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              type="submit"
              disabled={
                updateMenuItemMutation.isPending ||
                uploadImageMutation.isPending
              }
              className="flex-1"
            >
              {updateMenuItemMutation.isPending
                ? "Updating..."
                : "Update Menu Item"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
