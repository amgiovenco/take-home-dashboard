# Take Home React Application

A React Dashboard for the **VATN Systems 2025 Full-Stack Internship Technical Take-Home Project**. 
This app allows users to upload CSV files, visualize time-series data, and use interactive plots with global and selected statistics. 

## Features
- Upload any .csv file directly from home machine
- Parses & cleans data using **[PapaParse](https://www.papaparse.com/)**

## Plot Managment
- Displays numeric column as a time-series line chart using **[ECharts for React](https://www.npmjs.com/package/echarts-for-react)**
- Add & remove data channels
- Reorder plots with drag-an-drop from **[dndkit](https://dndkit.com/)**
- Charts are responsive via scroll zoom and bottom bar slider zoom

## Data Interactivity
- Zoom in on specific data ranges, stats are calculated in real-time
- View computed stats for both *\entire dataset\* & *selected\*
