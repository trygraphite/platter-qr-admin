import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/network';
import { QUERY_KEYS } from '@/keys/query-keys';
import type { CreateStaffRequest, GetStaffQuery } from '@/types/apiRequest/staff.request';

// Get all staff members
export function useStaffList(params?: GetStaffQuery) {
  const { staffApi } = useApi();
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_STAFF, params],
    queryFn: () => staffApi.getAllStaff(params).then(res => res.data),
  });
}

// Create staff member
export function useCreateStaff() {
  const { staffApi } = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStaffRequest) => staffApi.createStaff(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_ALL_STAFF] });
    },
  });
} 