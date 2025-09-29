// components/StatsPanel.js
import React from 'react';

const StatsPanel = ({ plots, selectedRange, csvData }) => {
  const calculateStats = (data, range = null) => {
    if (!data || data.length === 0) return null;
    
    const values = data
      .filter(point => !range || (point.time >= range.left && point.time <= range.right))
      .map(point => point.value)
      .filter(value => !isNaN(value));
    
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      mean: values.reduce((a, b) => a + b, 0) / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
      start: values[0],
      end: values[values.length - 1],
      count: values.length
    };
  };

  if (!plots || plots.length === 0) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">
        Statistics {selectedRange ? `(Selected Range: ${selectedRange.left.toFixed(1)}s - ${selectedRange.right.toFixed(1)}s)` : '(Full Dataset)'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plots.map(plot => {
          const stats = calculateStats(plot.data, selectedRange);
          if (!stats) return null;

          return (
            <div key={plot.id} className="bg-white p-3 rounded border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-2">{plot.channel}</h4>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <div className="text-gray-600">Min:</div>
                <div className="text-gray-800">{stats.min.toFixed(4)}</div>
                
                <div className="text-gray-600">Max:</div>
                <div className="text-gray-800">{stats.max.toFixed(4)}</div>
                
                <div className="text-gray-600">Mean:</div>
                <div className="text-gray-800">{stats.mean.toFixed(4)}</div>
                
                <div className="text-gray-600">Median:</div>
                <div className="text-gray-800">{stats.median.toFixed(4)}</div>
                
                <div className="text-gray-600">Start:</div>
                <div className="text-gray-800">{stats.start.toFixed(4)}</div>
                
                <div className="text-gray-600">End:</div>
                <div className="text-gray-800">{stats.end.toFixed(4)}</div>
                
                <div className="text-gray-600">Points:</div>
                <div className="text-gray-800">{stats.count}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsPanel;