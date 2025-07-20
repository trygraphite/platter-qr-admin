import { LoginRequest } from '@/types/apiRequest/account.request'
import type { LoginResponse } from '@/types/apiResponse/auth.payload'
import type { AxiosInstance } from 'axios'



export function authApi(axiosInstance: AxiosInstance) {
  return {
    login(payload: LoginRequest) {
      const {  ...rest } = payload
      return axiosInstance.post<LoginResponse>('/auth/login', rest, {
        // headers: {
        //   'enc-public-key': encPublicKey,
        // },
      })
    },
    // Switch to a managed business account
    switchToBusiness(businessId: string) {
      return axiosInstance.post(`/auth/switch-to/${businessId}`);
    },
  }
}
