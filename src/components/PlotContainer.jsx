import React from "react";
import { useMemo, useRef } from "react";
import ReactEcharts from "echarts-for-react";
import StatsPanel from "./StatsPanel";
import "../css/buttons.css";
import "../css/statsBoxes.css";
import "../css/chartStyling.css";
import { MdOutlineDelete } from 'react-icons/md';
import { IconContext } from "react-icons";
import { computeStats } from "../utils/stats";

export default function PlotContainer({ id, data, channel, onRemove }) {

  // Prepare time series
  const times = useMemo(() => data.rows.map((row) => row.time || row[Object.keys(row)[0]]), [data.rows]);
  const values = useMemo(() => data.rows.map((row) => row[channel]), [data.rows, channel]);

  // compute global stats
  const globalStats = useMemo(() => computeStats(values), [values]);

  // compute selected stats
  const [selectedStats, setSelectedStats] = React.useState(null);
  const lastSelectionRef = useRef(null);

  
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
  dataZoom: [{ type: "inside" }, { type: "slider" }]
};

const onEvents = useMemo(() => ({
  datazoom: (params) => {
    console.log('datazoom event triggered:', params);
    let startPercent, endPercent;
    if (params.batch && params.batch.length > 0) {
      startPercent = params.batch[0].start;
      endPercent = params.batch[0].end;
    } else if (params.start !== undefined && params.end !== undefined) {
      startPercent = params.start;
      endPercent = params.end;
    } else {
      console.log('No valid zoom data found');
      return;
    }

    const startIdx = Math.floor((startPercent / 100) * values.length);
    const endIdx = Math.floor((endPercent / 100) * values.length);
    console.log('Zoom range:', { startPercent, endPercent, startIdx, endIdx });

    if (startIdx < endIdx) {
      const selected = values.slice(startIdx, endIdx + 1);
      console.log('Selected values:', selected);
      const stats = computeStats(selected);
      console.log('Computed stats:', stats);
      setSelectedStats(stats);
    }
  }
}), []);



  return (
    <div className="flex flex-row">
    {/* title */}
    <div className="flex justify-between items-center">
      <h2 className="font-semibold">{channel}</h2>
    </div>

<div className = "flex flex-row">
      {/* graph and stats layout */}
      <div className="flex flex-col items-start">
        {/* graph */}
        <div className="chart-container">
          <ReactEcharts 
          option={option} style={{ height: "600px", width: "100%" }}
          onEvents={onEvents}/>
          {/* right-side stats + remove button */}
        <div className="stats-container1">
          <div className="stats-container-2">
            <h3>Global Stats</h3>
            <StatsPanel stats={globalStats} />
            <h3>Selected Stats</h3>
            {selectedStats ? (
              <StatsPanel stats={selectedStats} />
            ) : (
              <p>Zoom in on an area of the chart!</p>
            )}
            {/* button. */}
            <div className="remove-button">
              <button
                onClick={onRemove}
                className="remove-button">
                <IconContext.Provider value={{ color: "#B0B0B0", className: "MdOutlineDelete", size: "35px" }}>
                  <MdOutlineDelete />
                </IconContext.Provider>
              </button>
              </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
  );
}

// export default ChartContainer;