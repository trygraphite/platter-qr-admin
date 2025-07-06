import type { AxiosInstance, AxiosResponse } from 'axios';
import type { UploadPayload } from '@/types/apiResponse/upload.payload';

interface ApiResponse<T> {
  data: T;
}

export function uploadApi(axiosInstance: AxiosInstance) {
  return {
    uploadImage(file: File): Promise<AxiosResponse<ApiResponse<UploadPayload>>> {
      const formData = new FormData();
      formData.append('file', file);
      
      return axiosInstance.post<ApiResponse<UploadPayload>>('file/upload/single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  };
} 