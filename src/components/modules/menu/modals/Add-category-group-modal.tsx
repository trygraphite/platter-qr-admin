"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Layers } from "lucide-react"
import { toast } from "sonner"
import { useCreateMenuGroup } from "@/hooks/useMenu"

export function AddCategoryGroupModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const createCategoryGroupMutation = useCreateMenuGroup()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createCategoryGroupMutation.mutateAsync({ name, description })
      
      // Show success message
      toast.success("Category group created successfully!", {
        description: `${name} has been added to your menu groups`
      })
      
      setName("")
      setDescription("")
      setIsOpen(false)
    } catch (error) {
      console.error("Error adding category group:", error)
      toast.error("Failed to create category group", {
        description: "Please check your information and try again."
      })
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="default" className="text-white">
        <Layers className="h-4 w-4 mr-2" />
        Add Group
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Category Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Group Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description for this group"
              />
            </div>
            <Button type="submit" disabled={createCategoryGroupMutation.isPending}>
              {createCategoryGroupMutation.isPending ? "Creating..." : "Create Group"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
