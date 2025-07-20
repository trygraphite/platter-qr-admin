import { AxiosInstance, AxiosResponse } from 'axios';
import {
  CreateStaffRequest,
  GetStaffQuery,
} from '@/types/apiRequest/staff.request';
import {
  Staff,
  StaffListResponse,
} from '@/types/apiResponse/staff.payload';

export function staffApi(axiosInstance: AxiosInstance) {
  return {
    // Create a staff member
    createStaff(payload: CreateStaffRequest): Promise<AxiosResponse<Staff>> {
      return axiosInstance.post('/staff', payload);
    },

    // Get all staff members
    getAllStaff(params?: GetStaffQuery): Promise<AxiosResponse<StaffListResponse>> {
      return axiosInstance.get('/staff', { params });
    },
  };
} 