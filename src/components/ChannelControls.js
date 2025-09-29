// components/ChannelControls.js
import React from 'react';

const ChannelControls = ({ plot, plots, csvData, onChannelChange, onRemove }) => {
  const availableChannels = Object.keys(csvData[0] || {}).filter(
    key => key !== 'time (s)' && !plots.some(p => p.channel === key && p.id !== plot.id)
  );

  return (
    <div className="flex items-center space-x-4">
      <select
        value={plot.channel}
        onChange={(e) => onChannelChange(e.target.value)}
        className="border border-gray-300 rounded px-3 py-1 text-sm"
      >
        <option value={plot.channel}>{plot.channel}</option>
        {availableChannels.map(channel => (
          <option key={channel} value={channel}>
            {channel}
          </option>
        ))}
      </select>
      
      <button
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 text-sm font-medium"
      >
        Remove Plot
      </button>
    </div>
  );
};

export default ChannelControls;