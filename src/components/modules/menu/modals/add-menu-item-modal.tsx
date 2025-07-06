"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { useCreateMenuItem } from "@/hooks/useMenu"
import { useServicePoints } from "@/hooks/useServicePoints"
import { ImageUploader } from "@/components/custom/image-uploader"
import type { MenuCategory } from "@/types/apiResponse/menu.payload"
import { useApi } from "@/network"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

interface MenuItemVariety {
  name: string
  price: string
  options: string
  stockStatus: "in-stock" | "low-stock" | "out-of-stock"
}

interface AddMenuItemModalProps {
  isOpen: boolean
  onClose: () => void
  category: MenuCategory
}

export function AddMenuItemModal({ isOpen, onClose, category }: AddMenuItemModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [isAvailable, setIsAvailable] = useState(true)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("")
  const [varieties, setVarieties] = useState<MenuItemVariety[]>([])
  const [selectedServicePoint, setSelectedServicePoint] = useState<string>("")

  const { uploadApi } = useApi()
  const createMenuItemMutation = useCreateMenuItem()
  const { data: servicePointsData, isLoading: servicePointsLoading } = useServicePoints()
  const servicePoints = servicePointsData?.data?.docs || []

  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => uploadApi.uploadImage(file),
    onSuccess: (response) => {
      const imageUrl = response.data.data.url
      setUploadedImageUrl(imageUrl)
      setImagePreview(imageUrl)
      toast.success("Image uploaded successfully!")
    },
    onError: (error) => {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image", {
        description: "Please try again."
      })
    },
  })

  const handleImageChange = async (file: File) => {
    // Upload the image first
    uploadImageMutation.mutate(file)
  }

  const addVariety = () => {
    const newVariety: MenuItemVariety = {
      name: "",
      price: "",
      options: "",
      stockStatus: "in-stock",
    }
    setVarieties([...varieties, newVariety])
  }

  const removeVariety = (index: number) => {
    setVarieties(varieties.filter((_, i) => i !== index))
  }

  const updateVariety = (index: number, field: keyof MenuItemVariety, value: string) => {
    const updatedVarieties = varieties.map((variety, i) => (i === index ? { ...variety, [field]: value } : variety))
    setVarieties(updatedVarieties)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedServicePoint) {
      toast.error("Service point required", {
        description: "Please select a service point"
      })
      return
    }

    // Get the group ID from the category
    const groupId = typeof category.group === "string" ? category.group : category.group?._id

    try {
      let preparedVarieties: Array<{
        name: string
        price: number
        description: string
        image: string
        isAvailable: boolean
        isDefault: boolean
      }> = []

      // If custom varieties exist, use them
      if (varieties.length > 0) {
        preparedVarieties = varieties.map((variety, index) => ({
          name: variety.name,
          price: Number.parseFloat(variety.price),
          description: variety.options || "",
          image: uploadedImageUrl || "",
          isAvailable: variety.stockStatus === "in-stock",
          isDefault: index === 0, // First custom variety is the default
        }))
      }

      const menuItemData = {
        name,
        description,
        price: Number.parseFloat(price),
        isAvailable,
        image: uploadedImageUrl,
        servicePoint: selectedServicePoint,
        category: category._id,
        group: groupId || "",
        varieties: preparedVarieties,
      }

      await createMenuItemMutation.mutateAsync(menuItemData)

      // Show success message
      toast.success("Menu item created successfully!", {
        description: `${name} has been added to ${category.name}`
      })

      // Reset form
      setName("")
      setDescription("")
      setPrice("")
      setIsAvailable(true)
      setImagePreview(null)
      setUploadedImageUrl("")
      setVarieties([])
      setSelectedServicePoint("")
      onClose()
    } catch (error) {
      console.error("Error adding menu item:", error)
      toast.error("Failed to create menu item", {
        description: "Please check your information and try again."
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Menu Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Item Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
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
            <Select value={selectedServicePoint} onValueChange={setSelectedServicePoint} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a service point" />
              </SelectTrigger>
              <SelectContent>
                {servicePointsLoading ? (
                  <SelectItem value="" disabled>Loading service points...</SelectItem>
                ) : servicePoints.length === 0 ? (
                  <SelectItem value="" disabled>No service points available</SelectItem>
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
              <p className="text-sm text-muted-foreground mt-1">Uploading image...</p>
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
          {varieties.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Varieties (Optional)</Label>
                <Button type="button" variant="outline" size="sm" onClick={addVariety}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variety
                </Button>
              </div>

              <div className="space-y-4 border rounded-lg p-4 max-h-60 overflow-y-auto">
                {varieties.map((variety, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Variety {index + 1}</span>
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeVariety(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`variety-name-${index}`}>Name</Label>
                        <Input
                          id={`variety-name-${index}`}
                          value={variety.name}
                          onChange={(e) => updateVariety(index, "name", e.target.value)}
                          placeholder="e.g., Small, Medium, Large"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`variety-price-${index}`}>Price</Label>
                        <Input
                          id={`variety-price-${index}`}
                          type="number"
                          step="0.01"
                          value={variety.price}
                          onChange={(e) => updateVariety(index, "price", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`variety-stock-${index}`}>Stock Status</Label>
                        <Select
                          value={variety.stockStatus}
                          onValueChange={(value: "in-stock" | "low-stock" | "out-of-stock") =>
                            updateVariety(index, "stockStatus", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in-stock">In Stock</SelectItem>
                            <SelectItem value="low-stock">Low Stock</SelectItem>
                            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`variety-options-${index}`}>Options (comma-separated)</Label>
                        <Input
                          id={`variety-options-${index}`}
                          value={variety.options}
                          onChange={(e) => updateVariety(index, "options", e.target.value)}
                          placeholder="Extra cheese, No onions"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show Add Variety button when no varieties exist */}
          {varieties.length === 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Varieties (Optional)</Label>
                <Button type="button" variant="outline" size="sm" onClick={addVariety}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variety
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                No varieties added. Add varieties if this item has different sizes, options, or prices.
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={createMenuItemMutation.isPending || uploadImageMutation.isPending}
            className={createMenuItemMutation.isPending || uploadImageMutation.isPending ? "opacity-70 cursor-not-allowed" : ""}
          >
            {createMenuItemMutation.isPending ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Adding...
              </span>
            ) : (
              "Add Menu Item"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
