import React, { useRef } from "react";
import Papa from "papaparse";
import { MdOutlineFileUpload } from "react-icons/md";
import { IconContext } from "react-icons";

export default function UploadCSV({ onUpload }) {
  const fileInputRef = useRef(null);

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
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFile}
        style={{ display: "none" }}
      />
    </div>
  );
}

// export default UploadCSV;
