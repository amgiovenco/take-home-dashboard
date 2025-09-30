import React from 'react';
import Papa from 'papaparse';

export default function UploadCSV({ onUpload }) {
    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: (results) => {
                const columns = results.meta.fields;
                onUpload({ rows: results.data, columns });
            },
        });
    };

    return (
        <div className = "mb-4">
            <label className = "block mb-2 text-sm font-medium text-gray-700">
                Upload CSV File:
            </label>
            <input
                type = "file"
                accept = ".csv"
                onChange = {handleFile}
                className = "border border-gray-300 rounded p-2"
            />
        </div>
    );
}

// export default UploadCSV;