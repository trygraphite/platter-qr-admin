import { AxiosInstance } from 'axios';
import {
  CreateMenuGroupRequest,
  CreateMenuCategoryRequest,
  CreateMenuItemRequest,
  UpdateMenuGroupRequest,
  UpdateMenuCategoryRequest,
  UpdateMenuItemRequest,
} from '@/types/apiRequest/menu.request';
import {
  MenuListQuery,
  MenuGroupListResponse,
  MenuCategoryListResponse,
  MenuItemListResponse,
  MenuGroup,
  MenuCategory,
  MenuItem,
} from '@/types/apiResponse/menu.payload';

export function menuApi(axiosInstance: AxiosInstance) {
  return {
    // Menu Group
    createMenuGroup(payload: CreateMenuGroupRequest) {
      return axiosInstance.post('/menu/group', payload);
    },
    getAllMenuGroups(params?: MenuListQuery) {
      return axiosInstance.get<MenuGroupListResponse>('/menu/group', { params });
    },
    updateMenuGroup(groupId: string, payload: UpdateMenuGroupRequest) {
      return axiosInstance.patch<MenuGroup>(`/menu/group/${groupId}`, payload);
    },
    // Menu Category
    createMenuCategory(payload: CreateMenuCategoryRequest) {
      return axiosInstance.post('/menu/category', payload);
    },
    getAllMenuCategories(params?: MenuListQuery) {
      return axiosInstance.get<MenuCategoryListResponse>('/menu/category', { params });
    },
    getMenuGroupCategories(groupId: string, params?: MenuListQuery) {
      return axiosInstance.get<MenuCategoryListResponse>(`/menu/group/${groupId}/category`, { params });
    },
    updateMenuCategory(categoryId: string, payload: UpdateMenuCategoryRequest) {
      return axiosInstance.patch<MenuCategory>(`/menu/category/${categoryId}`, payload);
    },
    // Menu Item
    createMenuItem(payload: CreateMenuItemRequest) {
      return axiosInstance.post('/menu/item', payload);
    },
    getAllMenuItems(params?: MenuListQuery) {
      return axiosInstance.get<MenuItemListResponse>('/menu/item', { params });
    },
    getMenuGroupItems(groupId: string, params?: MenuListQuery) {
      return axiosInstance.get<MenuItemListResponse>(`/menu/group/${groupId}/item`, { params });
    },
    getMenuCategoryItems(categoryId: string, params?: MenuListQuery) {
      return axiosInstance.get<MenuItemListResponse>(`/menu/category/${categoryId}/item`, { params });
    },
    updateMenuItem(itemId: string, payload: UpdateMenuItemRequest) {
      return axiosInstance.patch<MenuItem>(`/menu/${itemId}`, payload);
    },
  };
}
