import React, { useState } from 'react';
import { cn } from '../../utils/helpers';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  actions?: {
    title: string;
    render: (record: T, index: number) => React.ReactNode;
  };
  emptyText?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = false,
  searchPlaceholder = 'Tìm kiếm...',
  onSearch,
  pagination,
  actions,
  emptyText = 'Không có dữ liệu',
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const renderPagination = () => {
    if (!pagination) return null;

    const { current, pageSize, total, onChange } = pagination;
    const totalPages = Math.ceil(total / pageSize);
    const startItem = (current - 1) * pageSize + 1;
    const endItem = Math.min(current * pageSize, total);

    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-secondary-200">
        <div className="text-sm text-secondary-600">
          Hiển thị {startItem} - {endItem} của {total} kết quả
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onChange(current - 1, pageSize)}
            disabled={current <= 1}
            className="flex items-center justify-center w-8 h-8 border border-secondary-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-50"
          >
            <span>‹</span>
          </button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber: number;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (current <= 3) {
                pageNumber = i + 1;
              } else if (current >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = current - 2 + i;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => onChange(pageNumber, pageSize)}
                  className={cn(
                    'w-8 h-8 text-sm font-medium rounded-lg',
                    current === pageNumber
                      ? 'bg-primary-600 text-white'
                      : 'text-secondary-600 hover:bg-secondary-50'
                  )}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onChange(current + 1, pageSize)}
            disabled={current >= totalPages}
            className="flex items-center justify-center w-8 h-8 border border-secondary-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-50"
          >
            <span>›</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-soft border border-secondary-100',
        className
      )}
    >
      {/* Header */}
      {searchable && (
        <div className="p-6 border-b border-secondary-200">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
              🔍
            </span>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full max-w-sm border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider',
                    column.sortable && 'cursor-pointer hover:bg-secondary-100',
                    column.className
                  )}
                  style={{ width: column.width }}
                  onClick={() =>
                    column.sortable && handleSort(column.key as string)
                  }
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && sortConfig?.key === column.key && (
                      <span className="text-primary-600">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  {actions.title}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                    <span className="ml-2 text-secondary-600">Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-12 text-center text-secondary-600"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              sortedData.map((record, index) => (
                <tr key={index} className="hover:bg-secondary-50">
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900"
                    >
                      {column.render
                        ? column.render(
                            record[column.key as keyof T],
                            record,
                            index
                          )
                        : String(record[column.key as keyof T] || '')}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      {actions.render(record, index)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
}
