import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link } from "react-router-dom";

const InterviewsReports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDownload = () => {
    // implement logic
    alert("Data downloaded");
  };
  return (
    <Sidebar>
      <div className="hero min-h-screen">
        <div className="form-control w-full max-w-xs">
          <div className="text-sm breadcrumbs">
            <ul>
              <li>
                <Link to="/visitors-management">Home</Link>
              </li>
              <li>Interviews Reports</li>
            </ul>
          </div>
          <div className="flex flex-col justify-center">
            <label className="label">
              <span className="label-text font-bold">Start Date</span>
            </label>
            <input
              type="date"
              value={startDate}
              className="input input-bordered w-full max-w-xs mb-4"
              onChange={(e) => setStartDate(e.target.value)}
            />
            <label className="label">
              <span className="label-text font-bold">End Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full max-w-xs mb-4"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button className="btn btn-outline" onClick={handleDownload}>
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default InterviewsReports;
