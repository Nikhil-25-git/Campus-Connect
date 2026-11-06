import React from 'react';
import { FolderSearch } from 'lucide-react';

const EmptyState = ({
  icon: Icon = FolderSearch,
  title = 'No Records Found',
  description = 'There are no items matching your criteria at this moment.',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-lg font-bold text-slate-800 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
