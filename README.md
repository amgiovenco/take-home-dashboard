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
- View computed stats for both entire dataset & selected
- Stats include min, max, mean, median, start, and end

## Component Architecture
### Dashboard.jsx
Main container managing app state, CSV uploads, plot creation, and reordering functionality

### UploadCSV.jsx
Handles CSV upload, parsing, and preprocessing via PapaParse

### PlotContainer.jsx
Displays time-seies plots using ECharts; handles zoom-based stats updates

### StatsPanel.jsx
Renders the stats in a easily readable list format

### SortableWrapper.jsx
Wraps each plot in a draggable context for the reordering funcationality. 
~~I didn't want to need this but it was a necessary evil.~~

### stats.js
Utility for computing stats


## Styling 
### Framework: Tailwind CSS
### Colors
Default Palette 
- Primary: #FFFFFF (White)
- Secondary: #B0CDD9 (Blue)
- Accent: #B0B0B0 (Grey)

Additional Colors Used
- Text: #000 (Black)
- Hovers: #B0CDD9 (Darker Blue) & #B41C1C (Red)
- Stats Panel Background: #F0EEEE (Darker Grey)

## Author
Alessandra Giovenco
<br>
Worcester Polytechnic Institute - BS Computer Science & Data Science 2026
