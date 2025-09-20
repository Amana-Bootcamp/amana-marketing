import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WeeklyData {
  week_start: string;
  week_end: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
}

interface WeeklyLineChartProps {
  data: WeeklyData[];
  title: string;
  metric?: 'revenue' | 'spend' | 'both';
}

export function WeeklyLineChart({ data, title, metric = 'both' }: WeeklyLineChartProps) {
  // Transform data for the chart
  const chartData = data.map(item => ({
    week: `Week of ${item.week_start.slice(5, 10)}`,
    revenue: item.revenue,
    spend: item.spend,
  }));

  return (
    <div className="p-6 bg-gray-800 border border-gray-700 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="week"
            stroke="#9ca3af"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          {(metric === 'revenue' || metric === 'both') && (
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#10b981"
              fontSize={12}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#10b981' } }}
            />
          )}
          {(metric === 'spend' || metric === 'both') && (
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#f59e0b"
              fontSize={12}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              label={{ value: 'Spend ($)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#f59e0b' } }}
            />
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f3f4f6',
            }}
            formatter={(value: number, name: string) => [
              `$${value.toLocaleString()}`,
              name === 'revenue' ? 'Revenue' : 'Spend'
            ]}
            labelStyle={{ color: '#f3f4f6' }}
          />
          <Legend
            wrapperStyle={{ color: '#f3f4f6' }}
          />
          {(metric === 'revenue' || metric === 'both') && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8 }}
            />
          )}
          {(metric === 'spend' || metric === 'both') && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="spend"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
