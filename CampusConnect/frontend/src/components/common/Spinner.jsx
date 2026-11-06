import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner = ({ size = 'md', text = 'Loading...', fullScreen = false }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
      <Loader2 className={`${sizeMap[size] || sizeMap.md} animate-spin text-blue-600`} />
      {text && <p className="text-sm font-medium animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
          {content}
        </div>
      </div>
    );
  }

  return <div className="py-12 flex justify-center">{content}</div>;
};

export default Spinner;
