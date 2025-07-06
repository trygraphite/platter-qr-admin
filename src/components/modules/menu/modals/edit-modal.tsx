"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import type { MenuGroup, MenuCategory, MenuItem, MenuVariety } from "@/types/apiResponse/menu.payload"

type EditableItem = MenuGroup | MenuCategory | MenuItem
type ItemType = "categoryGroup" | "category" | "menuItem"

interface EditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: EditableItem | null
  itemType: ItemType
  onSave: (data: EditableItem) => void
  isLoading?: boolean
}

export function EditModal({ open, onOpenChange, item, itemType, onSave, isLoading = false }: EditModalProps) {
  const [formData, setFormData] = useState<Partial<EditableItem>>({})
  const [varieties, setVarieties] = useState<Partial<MenuVariety>[]>([])

  useEffect(() => {
    if (item) {
      setFormData({ ...item })
      if ("varieties" in item && item.varieties) {
        setVarieties(item.varieties)
      }
    } else {
      // Reset form for new items
      setFormData({
        name: "",
        description: "",
        price: 0,
        isAvailable: true,
      })
      setVarieties([])
    }
  }, [item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dataToSave = { ...formData } as EditableItem
    if (itemType === "menuItem") {
      (dataToSave as MenuItem).varieties = varieties as MenuVariety[]
    }
    onSave(dataToSave)
  }

  const getTitle = () => {
    const action = item ? "Edit" : "Create"
    const type = itemType.replace(/([A-Z])/g, " $1").toLowerCase()
    return `${action} ${type}`
  }

  const addVariety = () => {
    setVarieties([
      ...varieties,
      {
        name: "",
        price: (formData as MenuItem).price || 0,
        description: "",
        image: "",
        isAvailable: true,
        isDefault: false,
      },
    ])
  }

  const updateVariety = (index: number, field: keyof MenuVariety, value: string | number | boolean) => {
    const updatedVarieties = [...varieties]
    updatedVarieties[index] = { ...updatedVarieties[index], [field]: value }
    setVarieties(updatedVarieties)
  }

  const removeVariety = (index: number) => {
    setVarieties(varieties.filter((_, i) => i !== index))
  }

  const renderFormFields = () => {
    switch (itemType) {
      case "categoryGroup":
      case "category":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description (optional)"
              />
            </div>
          </>
        )

      case "menuItem":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter item name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Base Price (₦)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={(formData as MenuItem).price || 0}
                onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description (optional)"
              />
            </div>

            {/* Varieties Section */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Varieties (Optional)</Label>
                <Button type="button" variant="outline" size="sm" onClick={addVariety}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Variety
                </Button>
              </div>

              {varieties.length > 0 && (
                <div className="space-y-3 max-h-60 overflow-y-auto border rounded-md p-3">
                  {varieties.map((variety, index) => (
                    <div key={index} className="border rounded-md p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Variety {index + 1}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeVariety(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Name</Label>
                          <Input
                            value={variety.name || ""}
                            onChange={(e) => updateVariety(index, "name", e.target.value)}
                            placeholder="e.g., Small, Large"
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Price (₦)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={variety.price || 0}
                            onChange={(e) => updateVariety(index, "price", Number.parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="h-8"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Available</Label>
                          <Select
                            value={variety.isAvailable ? "true" : "false"}
                            onValueChange={(value) => updateVariety(index, "isAvailable", value === "true")}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Available</SelectItem>
                              <SelectItem value="false">Not Available</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Description</Label>
                          <Input
                            value={variety.description || ""}
                            onChange={(e) => updateVariety(index, "description", e.target.value)}
                            placeholder="Description for this variety"
                            className="h-8"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {varieties.length === 0 && (
                <p className="text-sm text-gray-500">
                  No varieties added. Add varieties if this item has different sizes, options, or prices.
                </p>
              )}
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{item ? "Make changes to this item." : "Create a new item."}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">{renderFormFields()}</div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
