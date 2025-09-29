// App.js
import React, { useState } from 'react';
import CSVUploader from './components/CSVUploader';
import PlotContainer from './components/PlotContainer';
import './App.css';

const App = () => {
  const [csvData, setCsvData] = useState(null);
  const [plots, setPlots] = useState([]);

  const handleFileUpload = (data, headers) => {
    setCsvData(data);
    // Create initial plots for first few columns
    const initialPlots = headers.slice(1, 4).map((header, index) => ({
      id: `plot-${index}`,
      channel: header,
      data: data.map(row => ({
        time: row['time (s)'],
        value: row[header]
      }))
    }));
    setPlots(initialPlots);
  };

  return (
    <div className="app min-h-screen bg-white">
      <header className="bg-[#B0CDD9] p-4 shadow-md">
        <h1 className="text-2xl font-bold text-white text-center">
          Vatn Systems Data Visualization Dashboard
        </h1>
      </header>
      
      <main className="container mx-auto p-4">
        {!csvData ? (
          <CSVUploader onFileUpload={handleFileUpload} />
        ) : (
          <PlotContainer 
            csvData={csvData}
            plots={plots}
            setPlots={setPlots}
          />
        )}
      </main>
    </div>
  );
};

export default App;