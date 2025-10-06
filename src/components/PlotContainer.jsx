import React from "react";
import { useMemo } from "react";
import ReactEcharts from "echarts-for-react";
import StatsPanel from "./StatsPanel";
import "../css/buttons.css";
import "../css/statsBoxes.css";
import "../css/chartStyling.css";
import { MdOutlineDelete } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IconContext } from "react-icons";
import { computeStats } from "../utils/stats";

export default function PlotContainer({
  id,
  data,
  channel,
  onRemove,
  dragListeners,
}) {
  // prep raw time series
  const rawTimes = useMemo(
    () => data.rows.map((row) => row.time || row[Object.keys(row)[0]]),
    [data.rows]
  );
  const rawValues = useMemo(
    () => data.rows.map((row) => row[channel]),
    [data.rows, channel]
  );

  // filter out null/undefined points so they don't render on the line
  const filteredPairs = useMemo(() => {
    const out = [];
    for (let i = 0; i < rawTimes.length; i++) {
      const t = rawTimes[i];
      const v = rawValues[i];
      if (v === null || v === undefined) continue;
      // treat strings that parse to numbers as numbers
      const num = typeof v === "number" ? v : Number(v);
      if (Number.isNaN(num)) continue;
      out.push([t, num]);
    }
    return out;
  }, [rawTimes, rawValues]);

  // compute global stats from filtered values
  const globalStats = useMemo(
    () => computeStats(filteredPairs.map((p) => p[1])),
    [filteredPairs]
  );

  // compute selected stats
  const [selectedStats, setSelectedStats] = React.useState(null);

  const option = {
    title: {
      text: channel,
      textStyle: {
        fontFamily: "Nunito, sans-serif",
        fontSize: 18,
        fontWeight: "bold",
      },
      left: "center",
      top: 10,
    },
    textStyle: { fontFamily: "Nunito, sans-serif" },
    tooltip: { trigger: "axis" },
    grid: {
      bottom: 100,
      left: 90, 
      right: 20,
    },
    xAxis: {
      name: "Time in seconds",
      type: "value",
      nameLocation: "center",
      nameGap: 30,
      nameTextStyle: {
        fontSize: 16,
      },
    },
    yAxis: {
      name: channel,
      type: "value",
      nameRotate: 90,
      nameLocation: "center",
      nameGap: 45,
      nameTextStyle: {
        fontSize: 16,
      },
    },
    series: [
      {
        name: channel,
        type: "line",
        data: filteredPairs,
        smooth: true,
        color: "#B0CDD9",
      },
    ],
    dataZoom: [
      { type: "inside" },
      {
        type: "slider",
        height: 20,
        fillerColor: "rgba(194, 237, 255, 0.53)", // selected area
        backgroundColor: "#f0f0f0", // unselected area
        dataBackground: {
          lineStyle: {
            color: "#B0CDD9", // color of the mini line
          },
          areaStyle: {
            color: "#ffffffff", // fill under the mini line
          },
        },
        handleStyle: {
          color: "#B0B0B0",
        },
      },
    ],
  };

  const onEvents = useMemo(
    () => ({
      datazoom: (params) => {
        console.log("datazoom event triggered:", params);
        let startPercent, endPercent;
        if (params.batch && params.batch.length > 0) {
          startPercent = params.batch[0].start;
          endPercent = params.batch[0].end;
        } else if (params.start !== undefined && params.end !== undefined) {
          startPercent = params.start;
          endPercent = params.end;
        } else {
          console.log("No valid zoom data found");
          return;
        }

        // compute indices against filteredPairs (the plotted data)
        const startIdx = Math.floor(
          (startPercent / 100) * filteredPairs.length
        );
        const endIdx = Math.floor((endPercent / 100) * filteredPairs.length);
        console.log("Zoom range:", {
          startPercent,
          endPercent,
          startIdx,
          endIdx,
        });

        if (startIdx < endIdx) {
          const selected = filteredPairs
            .slice(startIdx, endIdx + 1)
            .map((p) => p[1]);
          console.log("Selected values:", selected);
          const stats = computeStats(selected);
          console.log("Computed stats:", stats);
          setSelectedStats(stats);
        }
      },
    }),
    []
  );

  return (
    <div className="flex flex-col w-full">
      {/* drag handle - positioned at top-left corner */}
      <div className="flex justify-between items-center p-1">
        <div
          className="handle-container"
          {...(dragListeners || {})}
          style={{ cursor: dragListeners ? "grab" : "default" }}
        >
          <IconContext.Provider value={{ color: "#b0cdd9", size: "30px" }}>
            <HiOutlineDotsHorizontal />
          </IconContext.Provider>
        </div>
      </div>

      <div className="flex flex-row">
        {/* graph and stats layout */}
        <div className="flex flex-col items-start">
          {/* graph */}
          <div className="chart-container">
            <ReactEcharts
              option={option}
              style={{ height: "600px", width: "100%" }}
              onEvents={onEvents}
            />

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

                {/* button*/}
                <div className="remove-button">
                  <button
                    onClick={onRemove}
                    className="remove-button"
                    style={{ pointerEvents: "auto", cursor: "pointer" }}
                  >
                    <IconContext.Provider
                      value={{
                        color: "#B0B0B0",
                        className: "MdOutlineDelete",
                        size: "35px",
                      }}
                    >
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
