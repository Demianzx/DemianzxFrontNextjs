import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | string;
  render?: (item: T) => React.ReactNode;
}

interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
}

function AdminDataTable<T extends Record<string, any>>({ 
  columns, 
  data, 
  onRowClick 
}: AdminDataTableProps<T>): React.ReactElement {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-900">
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index} 
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((item, index) => (
            <tr 
              key={index} 
              className={`${onRowClick ? 'cursor-pointer hover:bg-gray-700' : ''}`}
              onClick={() => onRowClick && onRowClick(item)}
            >
              {columns.map((column, colIndex) => {
                const accessor = column.accessor as keyof T;
                return (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    {column.render 
                      ? column.render(item) 
                      : String(item[accessor])}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDataTable;