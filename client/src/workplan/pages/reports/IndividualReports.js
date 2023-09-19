import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const IndividualReports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [marketer, setMarketer] = useState("");
  const [users, setUsers] = useState([]); // State to store users
  const token = useSelector((state) => state.user.token);

  // Use useEffect to fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://workspace.optiven.co.ke/api/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setUsers(
          data.filter(
            (user) =>
              user.Accessrole.split("#").includes("113") ||
              user.Accessrole.split("#").includes("workplanAdmin")
          )
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [token]);

  const handleDownload = async () => {
    if (!marketer || marketer === "") {
      toast.error("Marketer must be selected.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

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
      toast.error("End date cannot be before the start date.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      // Make a GET request to the backend route with query parameters
      const response = await axios.get(
        `https://workspace.optiven.co.ke/api/workplan-reports/marketer?start_date=${startDate}&end_date=${endDate}&marketer=${marketer}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
      link.download = "individual_report.pdf";
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
            <h1 className="font-bold text-lg">INDIVIDUAL REPORTS</h1>
            <label className="label">
              <span className="label-text font-bold">Marketer</span>
            </label>
            <select
              className="select select-bordered w-full max-w-xs mb-4"
              onChange={(e) => setMarketer(e.target.value)}
              value={marketer}
            >
              <option value="" disabled>
                Select Marketer
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.user_id}>
                  {user.fullnames}
                </option>
              ))}
            </select>
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

export default IndividualReports;
