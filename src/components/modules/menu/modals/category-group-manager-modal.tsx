"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Edit } from "lucide-react"
import { toast } from "sonner"
import { useMenuGroups, useUpdateMenuGroup } from "@/hooks/useMenu"
import type { MenuGroup } from "@/types/apiResponse/menu.payload"

interface CategoryGroupManagerModalProps {
  isOpen: boolean
  onClose: () => void
  editingGroup?: MenuGroup | null
}

export function CategoryGroupManagerModal({ isOpen, onClose, editingGroup }: CategoryGroupManagerModalProps) {
  const [editingGroupState, setEditingGroupState] = useState<MenuGroup | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const { data: groupsData } = useMenuGroups()
  const updateCategoryGroupMutation = useUpdateMenuGroup()
  const categoryGroups: MenuGroup[] = groupsData?.data?.docs || []

  // Handle editingGroup prop - open directly in edit mode if provided
  useEffect(() => {
    if (editingGroup && isOpen) {
      setEditingGroupState(editingGroup)
      setName(editingGroup.name)
      setDescription(editingGroup.description || "")
    } else if (!isOpen) {
      // Reset when modal closes
      setEditingGroupState(null)
      setName("")
      setDescription("")
    }
  }, [editingGroup, isOpen])

  const handleEdit = (group: MenuGroup) => {
    setEditingGroupState(group)
    setName(group.name)
    setDescription(group.description || "")
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingGroupState) return

    try {
      await updateCategoryGroupMutation.mutateAsync({
        groupId: editingGroupState._id,
        payload: {
          name,
          description,
        },
      })

      // Show success message
      toast.success("Category group updated successfully!", {
        description: `${name} has been updated`
      })

      // Reset form and close edit mode
      setEditingGroupState(null)
      setName("")
      setDescription("")
      onClose() // Close the modal after successful update
    } catch (error) {
      console.error("Error updating group:", error)
      toast.error("Failed to update category group", {
        description: "Please check your information and try again."
      })
    }
  }

  const handleDelete = async () => {
    // Not implemented
    toast.info("Delete functionality coming soon!", {
      description: "Category group deletion will be available in a future update."
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingGroupState ? `Edit Group: ${editingGroupState.name}` : "Manage Category Groups"}
          </DialogTitle>
        </DialogHeader>

        {editingGroupState ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Group Name</Label>
              <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" disabled={updateCategoryGroupMutation.isPending}>
                {updateCategoryGroupMutation.isPending ? "Updating..." : "Update Group"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingGroupState(null)
                  setName("")
                  setDescription("")
                  onClose()
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {categoryGroups.map((group: MenuGroup) => (
              <div key={group._id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{group.name}</h3>
                    {group.description && <p className="text-sm text-muted-foreground">{group.description}</p>}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(group)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      disabled
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!editingGroupState && (
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
