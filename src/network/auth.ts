import { LoginRequest } from '@/types/apiRequest/account.request'
import type { AccountMeResponse } from '@/types/apiResponse/account.payload'
import type { AxiosInstance } from 'axios'



export function authApi(axiosInstance: AxiosInstance) {
  return {
    login(payload: LoginRequest) {
      const {  ...rest } = payload
      return axiosInstance.post<AccountMeResponse>('/auth/login', rest, {
        // headers: {
        //   'enc-public-key': encPublicKey,
        // },
      })
    },
  }
}
