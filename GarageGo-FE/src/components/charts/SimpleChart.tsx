import React from 'react';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleChartProps {
  data: ChartData[];
  type?: 'bar' | 'line' | 'pie';
  height?: number;
  showValues?: boolean;
}

export const SimpleChart: React.FC<SimpleChartProps> = ({ 
  data, 
  type = 'bar', 
  height = 200,
  showValues = false 
}) => {
  const maxValue = Math.max(...data.map(item => item.value));

  if (type === 'bar') {
    return (
      <div className="flex items-end justify-between gap-2" style={{ height }}>
        {data.map((item, index) => {
          const barHeight = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          const color = item.color || '#3b82f6';
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              {showValues && (
                <div className="text-xs text-gray-600 mb-2 transform -rotate-45 origin-center">
                  {item.value.toLocaleString()}
                </div>
              )}
              <div
                className="w-full rounded-t-lg hover:opacity-80 transition-all cursor-pointer"
                style={{ 
                  height: `${barHeight}%`, 
                  minHeight: '8px',
                  backgroundColor: color
                }}
                title={`${item.label}: ${item.value.toLocaleString()}`}
              ></div>
              <span className="text-xs text-gray-500 mt-2 text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  if (type === 'pie') {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="relative">
          <svg width="160" height="160" className="transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (item.value / total) * 360;
              const radius = 70;
              const circumference = 2 * Math.PI * radius;
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((currentAngle / 360) * circumference);
              
              const color = item.color || `hsl(${index * 60}, 70%, 50%)`;
              currentAngle += angle;
              
              return (
                <circle
                  key={index}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke={color}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="hover:opacity-80 cursor-pointer"
                >
                  <title>{`${item.label}: ${item.value.toLocaleString()} (${percentage.toFixed(1)}%)`}</title>
                </circle>
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">{total.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Tổng</div>
            </div>
          </div>
        </div>
        <div className="ml-6 space-y-2">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const color = item.color || `hsl(${index * 60}, 70%, 50%)`;
            
            return (
              <div key={index} className="flex items-center text-sm">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-gray-700">
                  {item.label}: {item.value.toLocaleString()} ({percentage.toFixed(1)}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Line chart (simple implementation)
  if (type === 'line') {
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 300;
      const y = height - (item.value / maxValue) * (height - 40);
      return `${x},${y}`;
    }).join(' ');

    return (
      <div style={{ height }}>
        <svg width="100%" height="100%" className="overflow-visible">
          <polyline
            points={points}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            className="hover:stroke-blue-600"
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 300;
            const y = height - (item.value / maxValue) * (height - 40);
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#3b82f6"
                  className="hover:fill-blue-600 cursor-pointer"
                >
                  <title>{`${item.label}: ${item.value.toLocaleString()}`}</title>
                </circle>
                <text
                  x={x}
                  y={height - 10}
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  return null;
};