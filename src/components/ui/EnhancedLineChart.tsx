import React from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface EnhancedLineChartProps {
  title: string;
  data: DataPoint[];
  width?: number;
  height?: number;
  formatValue?: (value: number) => string;
}

export function EnhancedLineChart({
  title,
  data,
  width = 700,
  height = 400,
  formatValue = (value: number) => value.toLocaleString(),
}: EnhancedLineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg text-center text-gray-500">
        No data available.
      </div>
    );
  }

  const values = data.map(d => d.value);
  const maxValue = Math.max(...values);
  const labels = data.map(d => d.label);

  const padding = 70;  // increased padding for more space on axes
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const xInterval = chartWidth / (labels.length - 1);
  const yInterval = chartHeight / maxValue;

  const points = data.map((d, i) => {
    const x = padding + i * xInterval;
    const y = height - padding - d.value * yInterval;
    return `${x},${y}`;
  }).join(' ');

  const referenceLines = [1, 0.75, 0.5, 0.25].map(percent => ({
    value: percent * maxValue,
    y: height - padding - percent * chartHeight,
  }));

  return (
    <div className="p-6 bg-gray-800 border border-gray-700 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {referenceLines.map((line, index) => (
          <g key={index}>
            <line
              x1={padding}
              y1={line.y}
              x2={width - padding}
              y2={line.y}
              stroke="#4b5563"
              strokeDasharray="4 4"
            />
            <text
              x={padding - 20}
              y={line.y + 5}
              textAnchor="end"
              fontSize="16"
              fill="#d1d5db"
              fontWeight="500"
            >
              {formatValue(line.value)}
            </text>
          </g>
        ))}

        {labels.map((label, i) => (
          <text
            key={i}
            x={padding + i * xInterval}
            y={height - padding + 50}
            textAnchor="end"
            fontSize="12"
            fill="#9ca3af"
            transform={`rotate(45, ${padding + i * xInterval}, ${height - padding + 50})`}
          >
            {label}
          </text>
        ))}

        <text
          x={-15}
          y={height / 2}
          textAnchor="middle"
          fontSize="18"
          fill="#ffffff"
          fontWeight="700"
          transform={`rotate(-90, -15, ${height / 2})`}
        >
          {title.includes('Revenue') ? 'Revenue ($)' : 'Spend ($)'}
        </text>

        <text
          x={width / 2}
          y={height - 10}
          textAnchor="middle"
          fontSize="16"
          fill="#f3f4f6"
          fontWeight="600"
        >
          Week
        </text>

        <polyline
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          points={points}
        />

        {data.map((d, i) => (
          <circle
            key={i}
            cx={padding + i * xInterval}
            cy={height - padding - d.value * yInterval}
            r="6"
            fill="#10b981"
            stroke="#1f2937"
            strokeWidth="2"
          />
        ))}

        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#d1d5db"
          strokeWidth="2"
        />
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#d1d5db"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
