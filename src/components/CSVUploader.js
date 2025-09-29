import React, { useCallback } from 'react';
import Papa, { parse } from 'papaparse'; // For CSV parsing

const CSVUploader = ({ onFileUpload }) => {
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const headers = result.data[0];
          const rows = result.data.slice(1).filter(row => row.length === headers.length);
          
          const parsedData = rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = parseFloat(row[index]) || row[index];
            });
            return obj;
          });
          
          onFileUpload(parsedData, headers);
        },
        header: false,
        skipEmptyLines: true
      });
    }
  }, [onFileUpload]);

  return (
    <div className = "flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#B0B0B0] rounded-lg bg-gray-50">
        <div className = "text-center mb-4">
            <h2 className = "text-xl font-semiboard text-gray-700 mb-2">
                Upload your CSV file
            </h2>
            <p className = "text-gray-600">
                Please upload a CSV file with time-series data.
            </p>
        </div>
        <label className="cursor-pointer bg-[#B0CDD9] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
            <span>
                Choose CSV File
            </span>
            <input
                type = "file"
                accept = ".csv"
                onChange = {handleFileUpload}
                className = "hidden"
            />
        </label>
        <div className = "mt-4 text-gray-500 text-sm">
            <p> Expected format: Column 1: time </p>
        </div>
    </div>
  );
};

export default CSVUploader;
