import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/network';
import { QUERY_KEYS } from '@/keys/query-keys';
import type {
  CreateMenuGroupRequest,
  CreateMenuCategoryRequest,
  CreateMenuItemRequest,
  UpdateMenuGroupRequest,
  UpdateMenuCategoryRequest,
  UpdateMenuItemRequest,
} from '@/types/apiRequest/menu.request';
import type { MenuListQuery } from '@/types/apiResponse/menu.payload';


// Menu Groups
export function useMenuGroups(params?: MenuListQuery) {
  const { menuApi } = useApi();
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_MENU_GROUPS, params],
    queryFn: () => menuApi.getAllMenuGroups(params).then(res => res.data),
  });
}

export function useCreateMenuGroup() {
  const { menuApi } = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMenuGroupRequest) => menuApi.createMenuGroup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_MENU_GROUPS] });
    },
  });
}

export function useUpdateMenuGroup() {
  const { menuApi } = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, payload }: { groupId: string; payload: UpdateMenuGroupRequest }) =>
      menuApi.updateMenuGroup(groupId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_MENU_GROUPS] });
    },
  });
}

export function useDeleteMenuGroup() {
  // Implement menuApi.deleteMenuGroup in your API first
  return () => { throw new Error('Not implemented'); };
}

// Menu Categories
export function useMenuCategories(params?: MenuListQuery) {
  const { menuApi } = useApi();
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_MENU_CATEGORIES, params],
    queryFn: () => menuApi.getAllMenuCategories(params).then(res => res.data),
  });
}

export function useMenuGroupCategories(groupId: string, params?: MenuListQuery) {
  const { menuApi } = useApi();
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MENU_GROUP_CATEGORIES, groupId, params],
    queryFn: () => menuApi.getMenuGroupCategories(groupId, params).then(res => res.data),
    enabled: !!groupId,
  });
}

export function useCreateMenuCategory() {
  const { menuApi } = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMenuCategoryRequest) => menuApi.createMenuCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_MENU_CATEGORIES] });
    },
  });
}

export function useUpdateMenuCategory() {
  const { menuApi } = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId, payload }: { categoryId: string; payload: UpdateMenuCategoryRequest }) =>
      menuApi.updateMenuCategory(categoryId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_MENU_CATEGORIES] });
    },
  });
}

export function useDeleteMenuCategory() {
  // Implement menuApi.deleteMenuCategory in your API first
  return () => { throw new Error('Not implemented'); };
}

// Menu Items
export function useMenuItems(params?: MenuListQuery) {
  const { menuApi } = useApi();
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_MENU_ITEMS, params],
    queryFn: () => menuApi.getAllMenuItems(params).then(res => res.data),
  });
}

export function useMenuGroupItems(groupId: string, params?: MenuListQuery) {
  const { menuApi } = useApi();
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MENU_GROUP_ITEMS, groupId, params],
    queryFn: () => menuApi.getMenuGroupItems(groupId, params).then(res => res.data),
    enabled: !!groupId,
  });
}

export function useMenuCategoryItems(categoryId: string, params?: MenuListQuery) {
  const { menuApi } = useApi();
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MENU_CATEGORY_ITEMS, categoryId, params],
    queryFn: () => menuApi.getMenuCategoryItems(categoryId, params).then(res => res.data),
    enabled: !!categoryId,
  });
}

export function useCreateMenuItem() {
  const { menuApi } = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMenuItemRequest) => menuApi.createMenuItem(payload),
    onSuccess: () => {
      // Invalidate all menu-related queries that might be affected
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_MENU_ITEMS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_MENU_CATEGORY_ITEMS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_MENU_GROUP_ITEMS] });
      // Also invalidate any queries that start with these keys to catch variations with params
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          const queryKey = query.queryKey[0];
          return queryKey === QUERY_KEYS.GET_ALL_MENU_ITEMS ||
                 queryKey === QUERY_KEYS.GET_MENU_CATEGORY_ITEMS ||
                 queryKey === QUERY_KEYS.GET_MENU_GROUP_ITEMS;
        }
      });
    },
  });
}

export function useUpdateMenuItem() {
  const { menuApi } = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, payload }: { itemId: string; payload: UpdateMenuItemRequest }) =>
      menuApi.updateMenuItem(itemId, payload),
    onSuccess: () => {
      // Invalidate all menu-related queries that might be affected
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_MENU_ITEMS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_MENU_CATEGORY_ITEMS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_MENU_GROUP_ITEMS] });
      // Also invalidate any queries that start with these keys to catch variations with params
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          const queryKey = query.queryKey[0];
          return queryKey === QUERY_KEYS.GET_ALL_MENU_ITEMS ||
                 queryKey === QUERY_KEYS.GET_MENU_CATEGORY_ITEMS ||
                 queryKey === QUERY_KEYS.GET_MENU_GROUP_ITEMS;
        }
      });
    },
  });
}

export function useDeleteMenuItem() {
  // Implement menuApi.deleteMenuItem in your API first
  return () => { throw new Error('Not implemented'); };
}

// Varieties (handled as part of MenuItem, not separate endpoints)
// If you add endpoints for varieties, add hooks here.

// QR Code (placeholder, not implemented in API)
export function useQRCode() {
  // Implement menuApi.fetchQRCode in your API first
  return () => { throw new Error('Not implemented'); };
} 