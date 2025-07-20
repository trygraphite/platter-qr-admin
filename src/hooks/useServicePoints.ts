import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/network';
import { QUERY_KEYS } from '@/keys/query-keys';
import type { GetServicePointsQuery } from '@/types/apiResponse/business.payload';

export function useServicePoints(params?: GetServicePointsQuery) {
  const { businessApi } = useApi();
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_SERVICE_POINTS, params],
    queryFn: () => businessApi.getAllServicePoints(params).then(res => res.data),
  });
} 