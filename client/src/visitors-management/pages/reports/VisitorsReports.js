import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const VisitorsReports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const token = useSelector((state) => state.user.token);

  const handleDownload = async () => {
    if (!startDate || !endDate) {
      toast.error("Both dates must be chosen before submitting the form.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (endDate < startDate) {
      toast.error("End date cannot be before start date.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      const response = await axios.get(
        "https://workspace.optiven.co.ke/api/visitors/download-pdf/visitors-info",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            startDate,
            endDate,
          },
          responseType: "blob",
        }
      );

      console.log(startDate, endDate);

      const file = new Blob([response.data], {
        type: "application/pdf",
      });

      const fileURL = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "visitors_report.pdf";
      link.click();

      toast.success("PDF downloaded successfully.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error(
        "An error occurred while downloading the PDF. Please try again later.",
        {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
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
              <li>Visitors Reports</li>
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

export default VisitorsReports;
