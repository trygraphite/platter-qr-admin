import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/network';
import { QUERY_KEYS } from '@/keys/query-keys';

export function useServicePoints(params?: any) {
  const { businessApi } = useApi();
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_SERVICE_POINTS, params],
    queryFn: () => businessApi.getAllServicePoints(params).then(res => res.data),
  });
} 