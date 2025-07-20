'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
  onSearchChange?: (value: string) => void;
  filter?: string;
  filterOptions?: { label: string; value: string }[];
  onFilterChange?: (value: string) => void;
  actions?: (row: T) => React.ReactNode;
}

export function Table<T extends { id?: string | number; _id?: string | number; [key: string]: unknown }>({
  columns,
  data,
  loading,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  sortKey,
  sortDirection,
  search,
  onSearchChange,
  filter,
  filterOptions,
  onFilterChange,
  actions,
}: TableProps<T>) {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <div className="flex gap-2 items-center">
          {onSearchChange && (
            <Input
              placeholder="Search..."
              value={search || ''}
              onChange={e => onSearchChange(e.target.value)}
              className="w-48"
            />
          )}
          {filterOptions && onFilterChange && (
            <Select value={filter} onValueChange={onFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <span>Rows per page:</span>
          <Select value={String(pageSize)} onValueChange={v => onPageSizeChange && onPageSizeChange(Number(v))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map(size => (
                <SelectItem key={size} value={String(size)}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key as string}
                  className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground cursor-pointer select-none"
                  onClick={() => col.sortable && onSortChange && onSortChange(col.key as string, sortKey === col.key && sortDirection === 'asc' ? 'desc' : 'asc')}
                >
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    <span className="ml-1">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                  )}
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-8">
                  No data found.
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={row.id || row._id || idx} className="hover:bg-muted/50">
                  {columns.map(col => (
                    <td key={col.key as string} className="px-4 py-3 text-sm">
                      {col.render ? col.render(row) : String(row[col.key as keyof T] || '')}
                    </td>
                  ))}
                  {actions && <td className="px-4 py-3 text-right">{actions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-4">
        <div>
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onPageChange && onPageChange(page - 1)} disabled={page <= 1}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => onPageChange && onPageChange(page + 1)} disabled={page >= totalPages}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
} 