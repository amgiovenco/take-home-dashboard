import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ReactEcharts from "echarts-for-react";
import "../css/buttons.css";
import { MdOutlineDelete } from 'react-icons/md';
import { IconContext } from "react-icons";


export default function ChartContainer({ id, data, channel, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Prepare time series
  const times = data.rows.map((row) => row.time || row[Object.keys(row)[0]]);
  const values = data.rows.map((row) => row[channel]);

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
      <ReactEcharts option={option} style={{ height: "400px" }} />
    </div>
  );
}

// export default ChartContainer;