
import React from 'react';
import { Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title: string;
  onAdd?: () => void;
  addButtonLabel?: string;
  isLoading?: boolean;
}

function DataTable<T extends { id: string | number }>({ 
  data, columns, title, onAdd, addButtonLabel, isLoading 
}: DataTableProps<T>) {
  
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="font-bold text-lg text-slate-800">{title}</h3>
        
        <div className="flex items-center gap-3">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input 
               type="text" 
               placeholder="Search..." 
               className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
             />
           </div>
           <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600">
             <Filter size={18} />
           </button>
           {onAdd && (
             <button 
               onClick={onAdd}
               className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
             >
               {addButtonLabel || 'Add New'}
             </button>
           )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 uppercase tracking-wider text-xs font-semibold">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group">
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && <ArrowUpDown size={12} className="text-slate-400 group-hover:text-indigo-600" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
               <tr>
                 <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                    Loading data...
                 </td>
               </tr>
            ) : data.length === 0 ? (
               <tr>
                 <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                    No records found.
                 </td>
               </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4">
                      {col.render ? col.render(row) : (row[col.key as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
         <p className="text-xs text-slate-500">Showing <span className="font-bold">1-10</span> of <span className="font-bold">{data.length}</span> results</p>
         <div className="flex gap-2">
           <button className="p-1.5 border border-slate-300 rounded hover:bg-white disabled:opacity-50" disabled><ChevronLeft size={16}/></button>
           <button className="p-1.5 border border-slate-300 rounded hover:bg-white"><ChevronRight size={16}/></button>
         </div>
      </div>
    </div>
  );
}

export default DataTable;
