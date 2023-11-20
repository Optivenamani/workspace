import React, { useState, useCallback } from "react";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";
import axios from "axios";

const HealthReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Get the token from local storage
  const token = localStorage.getItem("token");

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
        "http://localhost:8080/api/health/download-pdf",
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

      // Create a blob from the PDF stream
      const file = new Blob([response.data], {
        type: "application/pdf",
      });

      // Create a link and click it to trigger the download
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "health_report.pdf";
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
        "An error occurred while downloading the PDF. Please try again.",
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
      <section className="text-center overflow-x-hidden">
        <div className="hero min-h-screen bg-white">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold">Health</h1>
              <p className="py-6">
                Download the Specific Health Report you require by choosing the
                range of dates specified.
              </p>
            </div>
            <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
              <div className="form-control card-body">
                <h1 className="font-bold text-lg">Health Reports</h1>
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
                <div className="form-control mt-6">
                  <button className="btn btn-primary" onClick={handleDownload}>
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Sidebar>
  );
};

export default HealthReport;
