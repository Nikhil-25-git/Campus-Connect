import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 text-xs">
        <p className="font-bold text-slate-800 mb-1">{label}</p>
        <p className="text-blue-600 font-semibold">Attendance: {data.percentage}%</p>
        <p className="text-slate-500">Present: {data.present} / {data.total}</p>
      </div>
    );
  }
  return null;
};

const AttendanceTrendChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
        No attendance data recorded yet
      </div>
    );
  }

  // Format date labels for display (e.g. MM-DD)
  const formattedData = data.map((d) => ({
    ...d,
    displayDate: d.date.length > 5 ? d.date.substring(5) : d.date,
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={formattedData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="displayDate"
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="percentage"
            stroke="#2563eb"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#attendanceGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceTrendChart;
