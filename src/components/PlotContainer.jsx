import React from "react";
import { useMemo } from "react";
import ReactEcharts from "echarts-for-react";
import "../css/buttons.css";
import { MdOutlineDelete } from 'react-icons/md';
import { IconContext } from "react-icons";
import { computeStats } from "../utils/stats";
import StatsPanel from "./StatsPanel";

export default function PlotContainer({ id, data, channel, onRemove }) {

  // Prepare time series
  const times = data.rows.map((row) => row.time || row[Object.keys(row)[0]]);
  const values = data.rows.map((row) => row[channel]);

  // Compute global stats
  const globalStats = useMemo(() => computeStats(values), [values]);

  
  const option = {
    title: { text: channel },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: times },
    yAxis: { type: "value" },
    series: [
      {
        name: channel,
        type: "line",
        data: values,
        smooth: true,
      },
    ],
    dataZoom: [
        { type: "inside" }, 
        { type: "slider" }
    ],
  };

  const onEvents = {
    dataZoom: (params) => {
      // zoomed range
      const startIdx = Math.floor(params.batch[0].start / 100 * values.length);
      const endIdx = Math.floor(params.batch[0].end / 100 * values.length);
    },
  };


  return (
    <div className="">
      <div className="body">
        <h2 className="h2">{channel}</h2>
        <button
          onClick={onRemove}
          className="remove-button-placement">
            <IconContext.Provider value={{ color: "#B0B0B0", className: "MdOutlineDelete", size: "35px" }}>
            <MdOutlineDelete />
            </IconContext.Provider>
        </button>
      </div>
      <ReactEcharts option={option} onEvents={onEvents} style={{ height: "400px" }} />

        {/* Stats */}
        <div>
          <StatsPanel stats={globalStats} label="Global" />
        </div>
    </div>
  );
}

// export default ChartContainer;