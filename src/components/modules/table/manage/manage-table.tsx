'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, QrCode, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Table, TableColumn } from '@/components/custom/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useApi } from '@/network'
import { QUERY_KEYS } from '@/keys/query-keys'
import { BusinessTable } from '@/types/apiResponse/business.payload'
import { generateQRCode, generateTableQRUrl } from '@/utils/qr-code'
import { QRDisplay } from '@/components/custom/qr-display'
import { useActiveBusiness } from '@/hooks/useAccount'
import TableSkeleton from '@/components/skeleton-loader/table-skeleton'

const ManageTable = () => {
  const { businessApi } = useApi()
  const { data: accountData } = useActiveBusiness()
  const primaryBusiness = accountData?.data
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortKey, setSortKey] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [showQRCode, setShowQRCode] = useState(false)
  const [selectedTable, setSelectedTable] = useState<BusinessTable | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

  console.log("PRIMATRY BUSS",primaryBusiness)
  const { data: tablesData, isLoading, error, refetch } = useQuery({
    queryKey: [
      QUERY_KEYS.GET_ALL_BUSINESS_TABLES,
      { searchTerm, currentPage, pageSize, sortKey, sortDirection }
    ],
    queryFn: async () => {
      const response = await businessApi.getAllTables({
        search: searchTerm,
        page: currentPage,
        limit: pageSize,
        sort: sortKey ? `${sortDirection === 'desc' ? '-' : ''}${sortKey}` : undefined,
      });
      return response.data;
    },
  })

  const tables = tablesData?.data?.docs || []
  const totalItems = tablesData?.data?.totalItems || 0

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

  const handleDeleteTable = (table: BusinessTable) => {
    // TODO: Implement delete functionality
    toast.info(`Delete functionality coming soon for table: ${table.name}`)
  }

  const columns: TableColumn<BusinessTable>[] = [
    {
      key: 'name',
      label: 'Table Name',
      sortable: true,
    },
    {
      key: 'business',
      label: 'Business',
      render: (table) => table.business.name,
    },
    {
      key: 'createdBy',
      label: 'Created By',
      render: (table) => `${table.createdBy.firstName} ${table.createdBy.lastName}`,
    },
  ]

  const handleViewQRCode = async (table: BusinessTable) => {
    try {
      setSelectedTable(table)
      
      // Generate unique table link: tableID-tableName (kebab-case)
      const kebabName = table.name.toLowerCase().replace(/\s+/g, '-');
      const uniqueTableLink = `${table._id}-${kebabName}`;

      // Generate QR code URL
      const tableUrl = generateTableQRUrl(
        primaryBusiness?.subdomain?.toLowerCase().replace(/\s+/g, '-') || '',
        process.env.NEXT_PUBLIC_BASE_DOMAIN || '',
        uniqueTableLink
      )
        console.log("TABLE URL",tableUrl)
      const qrCodeDataUrl = await generateQRCode(tableUrl)

      setQrCodeUrl(qrCodeDataUrl)
      setShowQRCode(true)
    } catch (error) {
      console.error('Error generating QR code:', error)
      toast.error('Failed to generate QR code')
    }
  }

  const actions = (table: BusinessTable) => (
    <div className="flex items-center justify-end space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleViewQRCode(table)}
      >
        <QrCode className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDeleteTable(table)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">Failed to load tables</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Tables</h1>
          <p className="text-muted-foreground">View and manage your restaurant tables</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Table
        </Button>
      </div>

      {/* Table Component */}
      <Table
        columns={columns}
        data={tables}
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

      {/* QR Code Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Table QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {qrCodeUrl && selectedTable && (
              <QRDisplay
                qrCodeUrl={qrCodeUrl}
                tableName={selectedTable.name}
                type="table"
                restaurantName={primaryBusiness?.name || "The Sauce"}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ManageTable 