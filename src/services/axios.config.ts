import type { AxiosError, AxiosInstance } from 'axios'
import Axios from 'axios'
import Cookies from 'js-cookie'

import config from '@/utils/config'
import type { ApiErrorResponseType } from '@/types/apiErrors'
import { routes } from '@/lib/routes'

function createAxiosInstance(baseURL: string): AxiosInstance {
  const instance = Axios.create({
    baseURL,
  })

  instance.interceptors.request.use(
    (axConfig) => {
      const token = Cookies.get('access_token')
      axConfig.headers.Authorization = `Bearer ${token}`
      return axConfig
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    },
  )

  instance.interceptors.response.use(
    function (response) {
      if (response.status === 401) {
        if (window.location.pathname === routes.login) {
          return response
        }

        window.location.assign('/logout')
      }

      return response
    },
    function (error: AxiosError<ApiErrorResponseType>) {
      if (error?.response?.status === 401) {
        if (window.location.pathname !== routes.login) {
          window.location.assign('/logout')
        }
      }

      return Promise.reject(error)
    },
  )

  return instance
}

export default function useApiService() {
  return {
   platterApi: createAxiosInstance(config.platterApiUrl),
  }
}
