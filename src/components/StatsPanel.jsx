import React from "react";

export default function StatsPanel({ stats }) {
  if (!stats) return <p>No data</p>;

  return (
    <ul className="stats-list">
      <li>Min: {stats.min ?? "N/A"}</li>
      <li>Max: {stats.max ?? "N/A"}</li>
      <li>Mean: {stats.mean != null ? stats.mean.toFixed(2) : "N/A"}</li>
      <li>Median: {stats.median ?? "N/A"}</li>
      <li>Start: {stats.start ?? "N/A"}</li>
      <li>End: {stats.end ?? "N/A"}</li>
    </ul>
  );
}
