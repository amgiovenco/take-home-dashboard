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
        <div className = "body-font">
            <label className = "body-font">
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