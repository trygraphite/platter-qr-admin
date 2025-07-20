"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { CategoryGroup } from "@/types/MenuTypes"

interface CategoryGroupCardProps {
  categoryGroup: CategoryGroup
  onEdit: (group: CategoryGroup) => void
  onDelete: (id: string) => void
}

export function CategoryGroupCard({ categoryGroup, onEdit, onDelete }: CategoryGroupCardProps) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the category group "${categoryGroup.name}"?`)) {
      onDelete(categoryGroup.id)
    }
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <h3 className="text-xl font-semibold">{categoryGroup.name}</h3>
        {categoryGroup.description && <p className="text-sm text-muted-foreground">{categoryGroup.description}</p>}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm">{categoryGroup.categories.length} categories</p>
      </CardContent>
      <div className="flex justify-between p-2">
        <Button variant="outline" onClick={() => onEdit(categoryGroup)}>
          Edit
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}
