import React, { useState } from "react";
import "../css/someText.css";
import "../css/dropdown.css";
import UploadCSV from "../components/UploadCSV";
import PlotContainer from "../components/PlotContainer";
import SortableItem from "../components/SortableWrapper";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export function Dashboard() {
  const [data, setData] = useState([]); // parsed rows
  const [columns, setColumns] = useState([]); // col names
  const [plots, setPlots] = useState([]); // which cols are plotted

  // csv uploaded, store both rows and columns
  const handleCSV = (parsed) => {
    if (parsed && parsed.columns) {
      setData(parsed);
      setColumns(parsed.columns);

      // didn't need first column since it was just the count
      const initialPlots = parsed.columns.slice(1).filter((c) => c !== "time");
      setPlots(initialPlots);
    }
  };

  // add new channel as a plot
  const addChannel = (channelName) => {
    if (channelName && !plots.includes(channelName)) {
      setPlots([...plots, channelName]);
    }
  };

  //remove a channel
  const removeChannel = (channelName) => {
    setPlots(plots.filter((c) => c !== channelName));
  };

  // drag and drop reorder
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const oldIndex = plots.indexOf(active.id);
      const newIndex = plots.indexOf(over.id);
      setPlots(arrayMove(plots, oldIndex, newIndex));
    }
  };

  return (
    <div>
      <h1 className="title-text-container">VATN Systems Dashboard</h1>
      {/* Upload CSV */}
      <UploadCSV onUpload={handleCSV} />

      {/* Add Channel dropdown */}
      {columns.length > 0 && (
        <div className="custom-select">
          <select
            className="custom-select"
            onChange={(e) => {
              if (e.target.value) {
                addChannel(e.target.value);
                e.target.value = ""; // Reset selection
              }
            }}
            value=""
          >
            <option value="">Add a channel</option>
            {columns
              .filter((col) => !plots.includes(col) && col !== "time")
              .map((col, i) => (
                <option key={i} value={col}>
                  {col}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Render all plots in drag context */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={plots} strategy={verticalListSortingStrategy}>
          <div className="mt-6 space-y-6">
            {plots.map((channel) => (
              <SortableItem key={channel} id={channel}>
                <PlotContainer
                  data={data}
                  id={channel}
                  channel={channel}
                  onRemove={() => removeChannel(channel)}
                />
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default Dashboard;
