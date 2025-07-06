"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { MenuCategory, MenuGroup } from "@/types/apiResponse/menu.payload"
import { useMenuGroups, useUpdateMenuCategory } from "@/hooks/useMenu"

interface EditCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: MenuCategory
}

export function EditCategoryModal({ isOpen, onClose, category }: EditCategoryModalProps) {
  const [name, setName] = useState(category.name)
  const [description, setDescription] = useState(category.description || "")
  const [selectedGroupId, setSelectedGroupId] = useState<string>("")

  const { data: groupsData } = useMenuGroups()
  const updateCategoryMutation = useUpdateMenuCategory()
  const categoryGroups: MenuGroup[] = groupsData?.data?.docs || []

  // Get the group ID from the category (handle both string and object formats)
  const getGroupId = (group: string | MenuGroup): string => {
    return typeof group === "string" ? group : group._id
  }

  useEffect(() => {
    setName(category.name)
    setDescription(category.description || "")
    setSelectedGroupId(getGroupId(category.group))
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedGroupId) {
      toast.error("Group selection required", {
        description: "Please select a group"
      })
      return
    }

    try {
      await updateCategoryMutation.mutateAsync({
        categoryId: category._id,
        payload: {
          name,
          description,
          group: selectedGroupId,
        },
      })

      // Show success message
      toast.success("Category updated successfully!", {
        description: `${name} has been updated`
      })

      onClose()
    } catch (error) {
      console.error("Error updating category:", error)
      toast.error("Failed to update category", {
        description: "Please check your information and try again."
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="categoryGroup">Category Group</Label>
            <Select
              value={selectedGroupId}
              onValueChange={setSelectedGroupId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {categoryGroups.map((group: MenuGroup) => (
                  <SelectItem key={group._id} value={group._id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-2">
            <Button 
              type="submit" 
              disabled={updateCategoryMutation.isPending}
              className="flex-1"
            >
              {updateCategoryMutation.isPending ? "Updating..." : "Update Category"}
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
  )
}
