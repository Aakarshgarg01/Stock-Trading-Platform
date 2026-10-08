import { cn } from '../utils/cn';

export function Tabs({
  tabs = [],
  activeTab,
  onChange,
  variant = 'underline', // 'underline' | 'pills'
  className,
}) {
  return (
    <div
      className={cn(
        'flex items-center',
        variant === 'underline' && 'border-b border-slate-800 gap-6',
        variant === 'pills' && 'bg-slate-900/60 p-1 rounded-lg gap-1 border border-slate-800',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 text-sm font-medium transition-all duration-150 select-none cursor-pointer',
              variant === 'underline' && [
                'pb-3 pt-1 border-b-2 -mb-[1px]',
                isActive
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700',
              ],
              variant === 'pills' && [
                'px-3.5 py-1.5 rounded-md text-xs',
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
              ]
            )}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-semibold',
                  isActive
                    ? 'bg-blue-500/30 text-blue-200'
                    : 'bg-slate-800 text-slate-400'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
