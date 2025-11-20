import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Tidbit } from '../types';

interface StatsChartProps {
  history: Tidbit[];
}

const COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#3B82F6', '#6B7280'];

export const StatsChart: React.FC<StatsChartProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
        尚未收集到任何知識膠囊
      </div>
    );
  }

  const dataMap = history.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(dataMap).map(([name, value]) => ({ name, value }));

  return (
    <div className="w-full h-64 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">知識分佈</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Legend iconSize={8} fontSize={10} wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
