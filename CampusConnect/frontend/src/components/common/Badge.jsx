import React from 'react';

const Badge = ({ variant = 'default', children, size = 'sm' }) => {
  const variantStyles = {
    // Attendance
    Present: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Absent: 'bg-rose-50 text-rose-700 border-rose-200',
    Late: 'bg-amber-50 text-amber-700 border-amber-200',

    // Status
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Inactive: 'bg-slate-100 text-slate-600 border-slate-300',
    Graduated: 'bg-blue-50 text-blue-700 border-blue-200',
    Suspended: 'bg-red-50 text-red-700 border-red-200',

    // Roles
    admin: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    student: 'bg-sky-50 text-sky-700 border-sky-200',

    // Generic
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    default: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[11px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  const style = variantStyles[variant] || variantStyles.default;
  const sizeStyle = sizeStyles[size] || sizeStyles.sm;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${style} ${sizeStyle} transition-colors`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {children}
    </span>
  );
};

export default Badge;
