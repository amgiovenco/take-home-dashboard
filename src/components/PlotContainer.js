// components/PlotContainer.js
import React, { useState } from 'react';
import Plot from './Plot';
import ChannelControls from './ChannelControls';
import StatsPanel from './StatsPanel';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


const SortablePlot = ({ plot, onRemove, onChannelChange, plots, csvData, onRangeSelect }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: plot.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="cursor-move">
            <span className="text-gray-500">≡</span>
          </div>
          <ChannelControls
            plot={plot}
            plots={plots}
            csvData={csvData}
            onChannelChange={(newChannel) => onChannelChange(plot.id, newChannel)}
            onRemove={() => onRemove(plot.id)}
          />
        </div>
        <div className="p-4">
          <Plot
            data={plot.data}
            channel={plot.channel}
            onRangeSelect={onRangeSelect}
          />
        </div>
      </div>
    </div>
  );
};

const PlotContainer = ({ csvData, plots, setPlots }) => {
  const [selectedRange, setSelectedRange] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setPlots((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addPlot = () => {
    const headers = Object.keys(csvData[0]).filter(key => key !== 'time (s)');
    const availableChannels = headers.filter(header => 
      !plots.some(plot => plot.channel === header)
    );
    
    if (availableChannels.length > 0) {
      const newPlot = {
        id: `plot-${Date.now()}`,
        channel: availableChannels[0],
        data: csvData.map(row => ({
          time: row['time (s)'],
          value: row[availableChannels[0]]
        }))
      };
      setPlots([...plots, newPlot]);
    }
  };

  const removePlot = (plotId) => {
    setPlots(plots.filter(plot => plot.id !== plotId));
  };

  const updateChannel = (plotId, newChannel) => {
    setPlots(plots.map(plot => 
      plot.id === plotId 
        ? {
            ...plot,
            channel: newChannel,
            data: csvData.map(row => ({
              time: row['time (s)'],
              value: row[newChannel]
            }))
          }
        : plot
    ));
  };

  const handleRangeSelect = (range) => {
    setSelectedRange(range);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Data Visualization</h2>
        <button
          onClick={addPlot}
          className="bg-[#B0CDD9] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Plot
        </button>
      </div>

      <StatsPanel 
        plots={plots} 
        selectedRange={selectedRange}
        csvData={csvData}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={plots.map(plot => plot.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-6">
            {plots.map((plot) => (
              <SortablePlot
                key={plot.id}
                plot={plot}
                onRemove={removePlot}
                onChannelChange={updateChannel}
                plots={plots}
                csvData={csvData}
                onRangeSelect={handleRangeSelect}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {plots.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No plots added. Click "Add Plot" to get started.
        </div>
      )}
    </div>
  );
};

export default PlotContainer;