import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const COLORS = ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 text-xs">
        <p className="font-bold text-slate-800">{data.name}</p>
        <p className="text-blue-600 font-semibold">{data.value} Students</p>
      </div>
    );
  }
  return null;
};

const DepartmentPieChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
        No department data available
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: d.name,
    value: d.students || d.count || 0,
  }));

  const total = chartData.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full h-72">
      <div className="w-full sm:w-1/2 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={chartData}
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend */}
      <div className="w-full sm:w-1/2 space-y-2 overflow-y-auto max-h-56 pr-2">
        {chartData.map((dept, index) => {
          const pct = total > 0 ? Math.round((dept.value / total) * 100) : 0;
          return (
            <div key={dept.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate max-w-[170px]" title={dept.name}>
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-slate-600 font-medium truncate">{dept.name}</span>
              </div>
              <span className="font-semibold text-slate-800 ml-2">
                {dept.value} <span className="text-slate-400 font-normal">({pct}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentPieChart;
