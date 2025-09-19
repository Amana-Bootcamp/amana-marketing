// src/components/ui/line-chart.tsx

import React from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  title: string;
  data: DataPoint[];
  className?: string;
  height?: number;
  showValues?: boolean;
  formatValue?: (value: number) => string;
}

export function LineChart({
  title,
  data,
  className = '',
  height = 300,
  showValues = false,
  formatValue = (value: number) => value.toLocaleString(),
}: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className={`p-6 bg-gray-800 border border-gray-700 rounded-lg text-center text-gray-500 ${className}`}>
        No data available.
      </div>
    );
  }

  const values = data.map(d => d.value);
  const maxValue = Math.max(...values);
  const labels = data.map(d => d.label);
  
  const chartPadding = 30;
  const svgWidth = 600;
  const svgHeight = height + 80; // Increased height to make room for rotated labels and more vertical space
  const chartWidth = svgWidth - chartPadding * 2;
  const chartHeight = svgHeight - chartPadding * 2;
  const xInterval = chartWidth / (labels.length - 1);
  const yInterval = chartHeight / maxValue;

  const points = data.map((d, i) => {
    const x = chartPadding + i * xInterval;
    const y = svgHeight - chartPadding - d.value * yInterval - 30;
    return `${x},${y}`;
  }).join(' ');

  const referenceLines = [0.25, 0.5, 0.75, 1].map(percent => ({
    value: percent * maxValue,
    y: svgHeight - chartPadding - percent * chartHeight - 30,
  }));
  
  return (
    <div className={`p-6 bg-gray-800 border border-gray-700 rounded-2xl shadow-lg ${className}`}>
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines for better readability */}
          {referenceLines.map((line, index) => (
            <line
              key={`grid-${index}`}
              x1={chartPadding}
              y1={line.y}
              x2={svgWidth - chartPadding}
              y2={line.y}
              stroke="#374151"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}

          {/* Y-axis reference lines and labels */}
          {referenceLines.map((line, index) => (
            <g key={index}>
              <line
                x1={chartPadding}
                y1={line.y}
                x2={svgWidth - chartPadding}
                y2={line.y}
                stroke="#6b7280"
                strokeDasharray="2 2"
              />
              <text
                x={chartPadding - 15}
                y={line.y + 5}
                textAnchor="end"
                fontSize="14"
                fill="#d1d5db"
                fontWeight="500"
              >
                {formatValue(line.value)}
              </text>
            </g>
          ))}

          {/* Y-axis title */}
          <text
            x={15}
            y={chartPadding + chartHeight / 2}
            textAnchor="middle"
            fontSize="16"
            fill="#f3f4f6"
            fontWeight="700"
            transform={`rotate(-90, 15, ${chartPadding + chartHeight / 2})`}
          >
            {title.includes('Revenue') ? 'Revenue ($)' :
             title.includes('Spend') ? 'Spend ($)' :
             title.includes('Impressions') ? 'Impressions' :
             title.includes('Clicks') ? 'Clicks' :
             title.includes('Conversions') ? 'Conversions' : 'Value'}
          </text>

          {/* X-axis title */}
          <text
            x={svgWidth / 2}
            y={svgHeight - 10}
            textAnchor="middle"
            fontSize="16"
            fill="#f3f4f6"
            fontWeight="600"
          >
            Week
          </text>
          
          {/* X-axis labels */}
          {labels.map((label, i) => (
            <text
              key={i}
              x={chartPadding + i * xInterval}
              y={svgHeight - chartPadding + 15}
              textAnchor="end"
              fontSize="12"
              fill="#9ca3af"
              transform={`rotate(45, ${chartPadding + i * xInterval}, ${svgHeight - chartPadding + 15})`} // Rotate labels for better fit
            >
              {/* Shorten the label by removing "Week of" */}
              {label.replace('Week of ', '')}
            </text>
          ))}
          
          {/* The line itself */}
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            points={points}
          />
          
          {/* Data points as circles */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={chartPadding + i * xInterval}
              cy={svgHeight - chartPadding - d.value * yInterval - 30}
              r="6"
              fill="#10b981"
              stroke="#1f2937"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}