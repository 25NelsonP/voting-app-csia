import React, { useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import { FaTimes } from "react-icons/fa";

const ImportCSV = ({ groupId, handleCancel }) => {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    setImporting(true);
    if (!file) {
      alert("Please select a CSV file to upload");
      setImporting(false);
      return;
    }

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: function (results) {
        const emails = results.data.map((row) => row[0]);
        importCsv(emails);
      },
      error: function (error) {
        console.error("Error parsing CSV file:", error);
      },
    });
    setImporting(false);
  };

  const importCsv = async (emails) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/groups/import-csv/${groupId}`,
        { emails }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error importing users", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-md relative flex flex-col ">
        <h2 className="text-2xl font-bold mb-6">Import from CSV</h2>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button
          onClick={handleFileUpload}
          className="bg-blue-500 text-white p-2 mt-3 rounded"
        >
          {importing ? "Importing..." : "Import"}
        </button>
        <button onClick={handleCancel} className="absolute top-6 right-6">
          <FaTimes size={20} />
        </button>
      </div>
    </div>
  );
};

export default ImportCSV;
