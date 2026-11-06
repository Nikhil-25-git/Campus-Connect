import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue', // blue, green, amber, purple, rose
  trend,
}) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
      gradient: 'from-blue-600 to-indigo-600',
    },
    green: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      gradient: 'from-emerald-500 to-teal-600',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      gradient: 'from-amber-500 to-orange-600',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100',
      gradient: 'from-purple-600 to-indigo-600',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
      gradient: 'from-rose-500 to-red-600',
    },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
      {/* Decorative top border accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${scheme.gradient}`} />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</h3>
            {trend && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                {trend}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>

        {Icon && (
          <div className={`p-3.5 rounded-xl ${scheme.bg} ${scheme.text} group-hover:scale-110 transition-transform duration-200`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
