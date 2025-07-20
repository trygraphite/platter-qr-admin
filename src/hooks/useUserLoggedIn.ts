'use client'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useAuthStore } from '@/store/auth'
import { useApi } from '@/network'
import { QUERY_KEYS } from '@/keys/query-keys'


const useUserLoggedIn = () => {
  const { accountApi } = useApi()
  const { setUser } = useAuthStore()
  const router = useRouter()

  const { error, isLoading, data } = useQuery({
    queryKey: [QUERY_KEYS.GET_USER],
    queryFn: accountApi.getAccountDetails,
    enabled: true,
  })

  useEffect(() => {
    if (data) {
      const userData = data.data.data
      setUser({ ...userData, accountType: userData.accountType ?? '' })
    }
  }, [data, setUser])

  useEffect(() => {
    if (error) {
      toast.error('Unauthorized', {
        position: 'top-center',
        description: 'Session expired. Please log in again.',
      })
    }
  }, [error, router])

  return { isLoading: isLoading }
}

export default useUserLoggedIn
