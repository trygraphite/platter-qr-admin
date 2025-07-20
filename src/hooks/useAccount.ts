import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/network';
import { QUERY_KEYS } from '@/keys/query-keys';

export function useAccountDetails() {
  const { accountApi } = useApi();
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ACCOUNT_DETAILS],
    queryFn: () => accountApi.getAccountDetails().then(res => res.data),
  });
}

export function useActiveBusiness() {
  const { accountApi } = useApi();
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ACTIVE_BUSINESS],
    queryFn: () => accountApi.getActiveBusiness().then(res => res.data),
  });
} 