"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Trash } from "lucide-react"
import type { MenuCategory } from "@/types/apiResponse/menu.payload"
import { MenuItemsDialog } from "./menu-items-dialog"
import { useMenuCategoryItems } from "@/hooks/useMenu"
import { UtensilsCrossed } from "lucide-react"

interface CategoryCardProps {
  category: MenuCategory
  editMode: boolean
  onEdit: (category: MenuCategory) => void
}

export function CategoryCard({ category, editMode, onEdit }: CategoryCardProps) {
  const [isMenuItemsOpen, setIsMenuItemsOpen] = useState(false)
  const { data: menuItemsData, isLoading: itemsLoading } = useMenuCategoryItems(category._id)
  const menuItems = menuItemsData?.data?.docs || []
  const itemCount = menuItems.length
  const firstImageItem = menuItems.find((item) => !!item.image)

  return (
    <>
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border pb-6 shadow-sm">
        {/* Card Image or Placeholder */}
        <div className="relative w-full h-48 overflow-hidden">
          {firstImageItem ? (
            <img
              src={firstImageItem.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center justify-center">
              <UtensilsCrossed className="w-14 h-14 text-blue-500 mb-2" />
              <span className="text-lg font-semibold text-blue-700">{itemCount} Item{itemCount === 1 ? "" : "s"}</span>
              {itemsLoading && <span className="text-xs text-muted-foreground mt-1">Loading...</span>}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <h3 className="text-xl font-bold text-white p-4 drop-shadow-lg">{category.name}</h3>
          </div>
        </div>

        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground">{category.description || "No description provided"}</p>
        </CardContent>

        <CardFooter className="flex justify-between pt-0">
          <Button variant="outline" size="sm" onClick={() => setIsMenuItemsOpen(true)}>
            View Items
          </Button>

          {editMode && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(category)}>
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardFooter>
      </div>

      <MenuItemsDialog isOpen={isMenuItemsOpen} onClose={() => setIsMenuItemsOpen(false)} category={category} editMode={editMode} />
    </>
  )
}
