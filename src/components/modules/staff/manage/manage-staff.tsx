'use client'

import React, { useState } from 'react'
import { Plus, Edit, Trash2, } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Table, TableColumn } from '@/components/custom/table'
import { Badge } from '@/components/ui/badge'
import { Staff } from '@/types/apiResponse/staff.payload'
import { useStaffList } from '@/hooks/useStaff'
import { GetStaffQuery } from '@/types/apiRequest/staff.request'
import TableSkeleton from '@/components/skeleton-loader/table-skeleton'

const ManageStaff = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortKey, setSortKey] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Build query params
  const queryParams: GetStaffQuery = {
    search: searchTerm || undefined,
    page: currentPage,
    limit: pageSize,
    sort: sortKey || undefined,
  }

  const { data: staffData, isLoading, error, refetch } = useStaffList(queryParams)

  const staff = staffData?.data?.docs || []
  const totalItems = staffData?.data?.totalItems || 0


  // Show skeleton loading when data is being fetched
  if (isLoading) {
    return <TableSkeleton />
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  const handleSortChange = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key)
    setSortDirection(direction)
  }

  const handleEditStaff = (staff: Staff) => {
    // TODO: Implement edit functionality
    toast.info(`Edit functionality coming soon for staff: ${staff.firstName} ${staff.lastName}`)
  }

  const handleDeleteStaff = (staff: Staff) => {
    // TODO: Implement delete functionality
    toast.info(`Delete functionality coming soon for staff: ${staff.firstName} ${staff.lastName}`)
  }

  const columns: TableColumn<Staff>[] = [
    {
      key: 'firstName',
      label: 'Name',
      render: (staff) => `${staff.firstName} ${staff.lastName}`,
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      render: (staff) => staff.email.value,
    },
    {
      key: 'designation',
      label: 'Designation',
      render: (staff) => staff.designation,
    },
    {
      key: 'type',
      label: 'Type',
      render: (staff) => (
        <Badge variant={staff.type === 'waiter' ? 'default' : 'secondary'}>
          {staff.type.charAt(0).toUpperCase() + staff.type.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (staff) => staff.phone,
    },
    {
      key: 'status',
      label: 'Status',
      render: (staff) => (
        <Badge variant={staff.status === 'active' ? 'default' : 'destructive'}>
          {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
        </Badge>
      ),
    },
  ]

  const actions = (staff: Staff) => (
    <div className="flex items-center justify-end space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleEditStaff(staff)}
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDeleteStaff(staff)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">Failed to load staff members</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Staff</h1>
          <p className="text-muted-foreground">View and manage your restaurant staff members</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Staff
        </Button>
      </div>

      {/* Table Component */}
      <Table
        columns={columns}
        data={staff}
        loading={isLoading}
        page={currentPage}
        pageSize={pageSize}
        total={totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        sortKey={sortKey}
        sortDirection={sortDirection}
        search={searchTerm}
        onSearchChange={handleSearch}
        actions={actions}
      />
    </div>
  )
}

export default ManageStaff 