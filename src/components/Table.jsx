import { useState } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../utils/cn';

export function Table({
  columns,
  data = [],
  rowKey = 'id',
  onRowClick,
  className,
  emptyMessage = 'No data available',
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

  const handleSort = (col) => {
    if (!col.sortable) return;
    const key = col.key;
    if (sortKey === key) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else {
        setSortKey(null);
        setSortOrder('asc');
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const col = columns.find(c => c.key === sortKey);
    let valA = a[sortKey];
    let valB = b[sortKey];

    if (col?.sortFn) {
      return sortOrder === 'asc' ? col.sortFn(a, b) : col.sortFn(b, a);
    }

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }

    valA = (valA || '').toString().toLowerCase();
    valB = (valB || '').toString().toLowerCase();
    return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  return (
    <div className={cn('w-full overflow-x-auto rounded-lg border border-slate-800/80 bg-[#121721]', className)}>
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-slate-900/60 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col)}
                className={cn(
                  'px-4 py-3 whitespace-nowrap select-none',
                  col.sortable && 'cursor-pointer hover:text-slate-200 transition-colors',
                  col.align === 'right' && 'text-right',
                  col.align === 'center' && 'text-center',
                  col.headerClassName
                )}
              >
                <div className={cn(
                  'inline-flex items-center gap-1.5',
                  col.align === 'right' && 'justify-end w-full'
                )}>
                  <span>{col.label}</span>
                  {col.sortable && (
                    <span className="text-slate-500">
                      {sortKey === col.key ? (
                        sortOrder === 'asc' ? (
                          <ChevronUp className="w-3.5 h-3.5 text-blue-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-blue-400" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-60" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, idx) => (
              <tr
                key={typeof rowKey === 'function' ? rowKey(row) : row[rowKey] || idx}
                onClick={() => onRowClick && onRowClick(row)}
                className={cn(
                  'transition-colors duration-100 hover:bg-slate-800/40',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 py-3 whitespace-nowrap text-slate-300',
                      col.align === 'right' && 'text-right tabular-nums',
                      col.align === 'center' && 'text-center',
                      col.cellClassName
                    )}
                  >
                    {col.render ? col.render(row[col.key], row, idx) : (row[col.key] ?? '-')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
