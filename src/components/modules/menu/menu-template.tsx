"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AddCategoryModal } from "./modals/add-category-modal";
import { CategoryCard } from "./cards/category-card";
import { EditCategoryModal } from "./modals/edit-category-modal";
import { CategoryGroupManagerModal } from "./modals/category-group-manager-modal";
import { Switch } from "@/components/ui/switch";
import { useMenuGroups, useMenuCategories } from "@/hooks/useMenu";
import type { MenuGroup, MenuCategory } from "@/types/apiResponse/menu.payload";
import { AddCategoryGroupModal } from "./modals/Add-category-group-modal";

export function MenuManagement() {
  const [editMode, setEditMode] = useState(false);
  const [editCategoryModal, setEditCategoryModal] = useState<{
    isOpen: boolean;
    category: MenuCategory | null;
  }>({ isOpen: false, category: null });
  const [isGroupManagerModalOpen, setIsGroupManagerModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<MenuGroup | null>(null);

  const {
    data: groupsData,
    isLoading: groupsLoading,
    error: groupsError,
  } = useMenuGroups();
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useMenuCategories();

  const categoryGroups: MenuGroup[] = groupsData?.data?.docs || [];
  const allCategories: MenuCategory[] = categoriesData?.data?.docs || [];

  // Group categories by group._id
  const categoriesByGroup: Record<string, MenuCategory[]> =
    allCategories.reduce((acc, category) => {
      const groupId = typeof category.group === "string" ? category.group : category.group?._id;
      if (!groupId) return acc; // skip if no group
      if (!acc[groupId]) acc[groupId] = [];
      acc[groupId].push(category);
      return acc;
    }, {} as Record<string, MenuCategory[]>);

  const isLoading = groupsLoading || categoriesLoading;
  const error = groupsError || categoriesError;

  const openEditCategoryModal = (category: MenuCategory) => {
    setEditCategoryModal({ isOpen: true, category });
  };

  const closeEditCategoryModal = () => {
    setEditCategoryModal({ isOpen: false, category: null });
  };

  const openGroupManagerModal = (group?: MenuGroup) => {
    if (group) {
      setEditingGroup(group);
    }
    setIsGroupManagerModalOpen(true);
  };

  const closeGroupManagerModal = () => {
    setIsGroupManagerModalOpen(false);
    setEditingGroup(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Skeleton className="h-8 w-8 mr-2" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-4 w-96" />
        <div className="flex justify-end space-x-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Error</h1>
        <p>Failed to load menu data</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      {/* Header Section */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <MenuIcon className="h-8 w-8 mr-2" />
            <h1 className="text-3xl font-bold">Menu Management</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm mr-2">
              {editMode ? "Edit Mode On" : "View Mode"}
            </span>
            <Switch checked={editMode} onCheckedChange={setEditMode} />
          </div>
        </div>
        <p className="text-lg text-muted-foreground mb-6">
          Organize your menu items into categories and groups to improve
          customer experience
        </p>

        <div className="flex justify-end space-x-3">
          <AddCategoryModal />
          <AddCategoryGroupModal />
        </div>
      </header>

      {/* Grouped Categories Only */}
      {categoryGroups && categoryGroups.length > 0 ? (
        <div className="space-y-10">
          {categoryGroups.map((group: MenuGroup) => (
            <div key={group._id} className="border-b pb-8 last:border-b-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold">{group.name}</h2>
                  {group.description && (
                    <p className="text-muted-foreground">
                      {group.description}
                    </p>
                  )}
                </div>
                {editMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openGroupManagerModal(group)}
                  >
                    Edit Group
                  </Button>
                )}
              </div>

              {categoriesByGroup[group._id]?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoriesByGroup[group._id].map(
                    (category: MenuCategory) => (
                      <div key={category._id} className="relative">
                        <CategoryCard
                          category={category}
                          editMode={editMode}
                          onEdit={openEditCategoryModal}
                        />
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  No categories in this group yet
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">
            No Category Groups Yet
          </h3>
          <p className="text-muted-foreground mb-4">
            Create groups to organize your menu categories
          </p>
          <AddCategoryGroupModal />
        </div>
      )}

      {/* Edit Category Modal */}
      {editCategoryModal.category && (
        <EditCategoryModal
          isOpen={editCategoryModal.isOpen}
          onClose={closeEditCategoryModal}
          category={editCategoryModal.category}
        />
      )}

      {/* Category Group Manager Modal */}
      <CategoryGroupManagerModal
        isOpen={isGroupManagerModalOpen}
        onClose={closeGroupManagerModal}
        editingGroup={editingGroup}
      />
    </div>
  );
}

// attach service propvier to menu item