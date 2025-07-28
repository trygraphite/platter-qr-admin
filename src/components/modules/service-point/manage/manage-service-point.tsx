'use client'

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableColumn } from '@/components/custom/table';
import { useApi } from '@/network';
import { ServicePoint } from '@/types/apiResponse/business.payload';
import { ServicePointRequest } from '@/types/apiRequest/business.request';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import TableSkeleton from '@/components/skeleton-loader/table-skeleton';

const columns: TableColumn<ServicePoint>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'description', label: 'Description', sortable: false },
];

const ManageServicePoint = () => {
  const { businessApi } = useApi();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<ServicePoint | null>(null);
  const [editForm, setEditForm] = useState<ServicePointRequest>({ name: '', description: '' });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['service-points', page, pageSize, search],
    queryFn: () => businessApi.getAllServicePoints({ page, limit: pageSize, search }),
  });

  console.log('service point data', data);

  const servicePoints = data?.data?.data?.docs || [];

  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; data: ServicePointRequest }) =>
      businessApi.updateServicePoint(payload.id, payload.data),
    onSuccess: () => {
      toast.success('Service point updated!');
      setEditing(null);
      refetch();
    },
    onError: () => {
      toast.error('Failed to update service point');
    },
  });

  // Show skeleton loading when data is being fetched
  if (isLoading) {
    return <TableSkeleton />
  }

  const handleEdit = (sp: ServicePoint) => {
    setEditing(sp);
    setEditForm({ name: sp.name, description: sp.description });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ id: editing._id, data: editForm });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Manage Service Points</h1>
      <Table<ServicePoint>
        columns={columns as TableColumn<ServicePoint>[]}
        data={servicePoints as unknown as ServicePoint[]}
        loading={isLoading}
        page={data?.data?.data?.currentPage || 1}
        pageSize={data?.data?.data?.itemsPerPage || 10}
        total={data?.data?.data?.totalItems || 0}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        search={search}
        onSearchChange={setSearch}
        actions={(row) => (
          <Button size="sm" variant="outline" onClick={() => handleEdit(row)}>
            Edit
          </Button>
        )}
      />
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service Point</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={editForm.description}
                onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageServicePoint;
