"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useMenuGroups, useCreateMenuCategory } from "@/hooks/useMenu"
import type { MenuGroup } from "@/types/apiResponse/menu.payload"

export function AddCategoryModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [, setImageFile] = useState<File | null>(null)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)

  const { data: groupsData } = useMenuGroups()
  const createCategoryMutation = useCreateMenuCategory()

  const categoryGroups: MenuGroup[] = groupsData?.data?.docs || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const categoryData = {
        name,
        description,
        group: selectedGroupId || "",
      }

      await createCategoryMutation.mutateAsync(categoryData)

      // Show success message
      toast.success("Category created successfully!", {
        description: `${name} has been added to your menu`
      })

      // Reset form
      setName("")
      setDescription("")
      setImageFile(null)
      setSelectedGroupId(null)
      setIsOpen(false)
    } catch (error) {
      console.error("Error adding category:", error)
      toast.error("Failed to create category", {
        description: "Please check your information and try again."
      })
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline">
        Add Category
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
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
                onValueChange={(value) => setSelectedGroupId(value === "none" ? null : value)}
                defaultValue="none"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Ungrouped)</SelectItem>
                  {categoryGroups.map((group: MenuGroup) => (
                    <SelectItem key={group._id} value={group._id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={createCategoryMutation.isPending}
              className={createCategoryMutation.isPending ? "opacity-70 cursor-not-allowed" : ""}
            >
              {createCategoryMutation.isPending ? (
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding...
                </span>
              ) : (
                "Add Category"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
