import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MarketersFeedback = () => {
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
        "https://workspace.optiven.co.ke/api/site-visit-requests/download-pdf/marketer-feedback",
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
      link.download = "marketers_feedback.pdf";
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
      <div className="hero min-h-screen">
        <div className="form-control w-full max-w-xs">
          <div className="flex flex-col justify-center">
            <h1 className="font-bold text-lg">MARKETER FEEDBACK REPORTS</h1>
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

export default MarketersFeedback;
