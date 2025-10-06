import React, { useRef } from "react";
import Papa from "papaparse";
import { MdOutlineFileUpload } from "react-icons/md";
import { IconContext } from "react-icons";

export default function UploadCSV({ onUpload }) {
  const fileInputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        let columns = results.meta.fields;
        let rows = results.data;

        // that was to detect and remove the numerical index column of this specfic mock_data csv that was given
        // pretty typical for most datasets I've seen.

        if (
          Array.isArray(columns) && //columns exist, right?
          columns.length > 0 &&
          Array.isArray(rows) &&
          rows.length > 0
        ) {
          const firstCol = columns[0];
          const vals = rows.map((r) => r[firstCol]); // getting values
          const allNumbers = vals.every(
            (v) => typeof v === "number" && Number.isFinite(v)
          );
          // checking if numbers and if they form a sequential series
          if (allNumbers) {
            const start = vals[0];
            const isSequential = vals.every((v, i) => v === start + i);

            // if so, remove that numerical column from data and columns.
            if (isSequential) {
              columns = columns.slice(1);
              rows = rows.map((r) => {
                const copy = { ...r };
                delete copy[firstCol];
                return copy;
              });
            }
          }
        }
        // back to parent once cleaned
        onUpload({ rows, columns });
      },
    });
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="chooseFile-button" onClick={triggerFileSelect}>
      <IconContext.Provider
        value={{
          color: "#B0B0B0",
          className: "MdOutlineFileUpload",
          size: "35px",
        }}
      >
        <MdOutlineFileUpload />
      </IconContext.Provider>
      <span>Upload File</span>

      <input
        type="file"
        accept=".csv" // restricting to only CSV files, can be changed obvi.
        ref={fileInputRef} // attached ref so manual clicking works
        onChange={handleFile}
        style={{ display: "none" }} // you know what file you chose, no need to show input.  it felt unnecessary to show the file input element imo.
      />
    </div>
  );
}