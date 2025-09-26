import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { SkeletonTable } from './Skeleton';
import Icon from './Icon';

/**
 * 增强版数据表格组件，基于 @tanstack/react-table 实现
 * 兼容旧版 columns: { key, title, dataIndex, render, width, minWidth, maxWidth }
 *
 * 可控属性：
 * - density: 'default' | 'compact'
 * - columnVisibility: { [columnId]: boolean }
 */
const DataTablePro = ({
  columns,
  data = [],
  rowKey = 'id',
  onRowClick,
  className = '',
  loading = false,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  enableColumnResizing = true,
  stickyHeader = true,
  density = 'default',
  columnVisibility,
  onColumnVisibilityChange,
  emptyText = '暂无数据',
}) => {
  // 转换列配置为 TanStack Table 格式
  const tableColumns = useMemo(() => {
    return columns.map(col => ({
      id: col.key,
      accessorKey: col.dataIndex || col.key,
      header: col.title,
      cell: ({ row, getValue }) => {
        if (col.render) {
          return col.render(getValue(), row.original);
        }
        return getValue();
      },
      size: col.width ? Number(col.width) : 160,
      minSize: col.minWidth ? Number(col.minWidth) : 96,
      maxSize: col.maxWidth ? Number(col.maxWidth) : 640,
      enableSorting: col.enableSorting !== false,
      meta: {
        align: col.align || 'center'
      }
    }));
  }, [columns]);

  // 初始化表格实例
  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: !!pagination,
    manualSorting: true,
    enableColumnResizing,
    state: {
      pagination,
      sorting,
      columnVisibility,
    },
    onPaginationChange,
    onSortingChange,
    onColumnVisibilityChange,
  });

  // 渲染加载状态
  if (loading) {
    return <SkeletonTable headerCols={columns.length} rows={pagination?.pageSize || 10} />;
  }

  // 渲染空状态
  if (!data || data.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center p-10 text-gray-500 dark:text-gray-400 ${className}`}>
        <div className="text-4xl mb-2">📭</div>
        <div className="text-base">{emptyText}</div>
      </div>
    );
  }

  const isCompact = density === 'compact';
  const tdPad = isCompact ? 'py-1.5' : 'py-2';
  const textSize = isCompact ? 'text-[13px]' : 'text-sm';

  return (
    <div className={`overflow-auto rounded ${className}`}>
      <table className={`min-w-full ${textSize}`}>
        <thead
          className={`${stickyHeader ? 'sticky top-0 z-10' : ''} bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-800 shadow-[0_1px_0_rgba(0,0,0,0.02)]`}
        >
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className={`
                    group relative px-3 py-2 font-medium text-gray-700 dark:text-gray-300
                    ${header.column.columnDef.meta?.align === 'left' ? 'text-left' : header.column.columnDef.meta?.align === 'right' ? 'text-right' : 'text-center'}
                    ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                    ${header.column.getIsSorted() ? 'text-blue-600 dark:text-blue-400' : ''}
                    align-middle
                  `}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ width: header.getSize() }}
                >
                  <div className={`flex items-center gap-1 ${
                    header.column.columnDef.meta?.align === 'left' ? 'justify-start' : 
                    header.column.columnDef.meta?.align === 'right' ? 'justify-end' : 'justify-center'
                  }`}>
                    <div className="truncate">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                    {header.column.getCanSort() && (
                      <span className="inline-flex items-center text-gray-400">
                        {header.column.getIsSorted() === 'asc' && <Icon name="sortUp" className="w-3.5 h-3.5" />}
                        {header.column.getIsSorted() === 'desc' && <Icon name="sortDown" className="w-3.5 h-3.5" />}
                        {!header.column.getIsSorted() && <Icon name="sort" className="w-3.5 h-3.5" />}
                      </span>
                    )}
                  </div>
                  {enableColumnResizing && (
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`
                        absolute right-0 top-0 h-full w-1.5 cursor-col-resize select-none
                        bg-gray-200 dark:bg-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity
                        ${header.column.getIsResizing() ? 'opacity-100' : ''}
                      `}
                    />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.original[rowKey]}
              className={`odd:bg-gray-50/40 dark:odd:bg-zinc-900/30 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors`}
              onClick={() => onRowClick?.(row.original)}
            >
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className={`px-3 ${tdPad} align-middle ${
                    cell.column.columnDef.meta?.align === 'left' ? 'text-left' : 
                    cell.column.columnDef.meta?.align === 'right' ? 'text-right' : 'text-center'
                  }`}
                  style={{ width: cell.column.getSize() }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTablePro;
