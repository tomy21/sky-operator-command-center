/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

export type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  className?: string;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
  onItemsPerPageChange?: (value: number) => void;
};

export default function CommonTable<T>({
  data,
  columns,
  className,
  showPagination = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  itemsPerPage,
  totalItems,
  onItemsPerPageChange,
}: Props<T>) {
  return (
    <div className="w-full">
      <table
        className={`min-w-full border-collapse border border-gray-200 dark:border-gray-700 ${className}`}
      >
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300 border-b"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center px-4 py-6 text-gray-500"
              >
                Tidak ada data
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-4 py-2">
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showPagination && totalPages && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          {/* info */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}{" "}
            {totalItems ? `(${totalItems} items)` : ""}
          </div>

          {/* controls */}
          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange && onPageChange(currentPage - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange && onPageChange(currentPage + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>

            {onItemsPerPageChange && itemsPerPage && (
              <select
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                className="ml-4 border rounded px-2 py-1 text-sm"
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n} / page
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
