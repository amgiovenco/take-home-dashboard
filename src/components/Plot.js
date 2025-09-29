// components/Plot.js
import React, { useCallback, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush, ReferenceArea } from 'recharts';

const Plot = ({ data, channel, onRangeSelect }) => {
  const chartRef = useRef();
  const [refArea, setRefArea] = useState(null);

  const handleMouseDown = useCallback((e) => {
    if (!e || !e.activeLabel) return;
    setRefArea({
      left: e.activeLabel,
      right: e.activeLabel,
    });
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!refArea || !refArea.left || !e.activeLabel) return;
    setRefArea(prev => ({
      ...prev,
      right: e.activeLabel,
    }));
  }, [refArea]);

  const handleMouseUp = useCallback(() => {
    if (!refArea || !refArea.left || !refArea.right) {
      setRefArea(null);
      return;
    }

    const left = Math.min(parseFloat(refArea.left), parseFloat(refArea.right));
    const right = Math.max(parseFloat(refArea.left), parseFloat(refArea.right));
    
    onRangeSelect({ left, right });
    setRefArea(null);
  }, [refArea, onRangeSelect]);

  const formatTime = (time) => {
    return typeof time === 'number' ? time.toFixed(1) : time;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          ref={chartRef}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="time" 
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={formatTime}
            label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            label={{ value: channel, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value) => [value?.toFixed(4), channel]}
            labelFormatter={(label) => `Time: ${formatTime(label)}s`}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#B0CDD9"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, stroke: '#B0CDD9', strokeWidth: 2 }}
          />
          <Brush 
            dataKey="time"
            height={30}
            stroke="#B0B0B0"
            tickFormatter={formatTime}
          />
          {refArea && refArea.left && refArea.right && (
            <ReferenceArea
              x1={refArea.left}
              x2={refArea.right}
              strokeOpacity={0.3}
              fill="#B0CDD9"
              fillOpacity={0.3}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Plot;