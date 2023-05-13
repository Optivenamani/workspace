import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/Sidebar";

const Survey = () => {
  const [visited, setVisited] = useState("");
  const [booked, setBooked] = useState("");
  const [amountReserved, setAmountReserved] = useState(0);
  const [plotDetails, setPlotDetails] = useState("");
  const [reasonNotBooked, setReasonNotBooked] = useState("");
  const [reasonNoVisit, setReasonNoVisit] = useState("");

  const navigate = useNavigate();

  const { id } = useParams();

  const handleVisitedChange = (event) => {
    setVisited(event.target.value);
    setBooked("");
    setAmountReserved(0);
    setPlotDetails("");
    setReasonNotBooked("");
    setReasonNoVisit("");
  };

  const handleBookedChange = (event) => {
    setBooked(event.target.value);
    setAmountReserved(0);
    setPlotDetails("");
    setReasonNotBooked("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Convert visited and booked values to tinyint
    const visitedInt = visited === "Yes" ? 1 : 0;
    const bookedInt = booked === "Yes" ? 1 : 0;

    const surveyData = {
      visited: visitedInt,
      booked: bookedInt,
      amount_reserved: parseFloat(amountReserved) || null,
      plot_details: plotDetails || null,
      reason_not_visited: reasonNoVisit || null,
      reason_not_booked: reasonNotBooked || null,
    };

    console.log(surveyData);

    // Get the token from local storage
    const token = localStorage.getItem("token");

    try {
      // Include the JWT in the request headers
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(
        `https://209.38.246.14:8080/api/site-visit-requests/submit-survey/${id}`,
        surveyData,
        config
      );
      navigate("/");
    } catch (error) {
      toast.error(
        "An error occurred while submitting the survey. It is possible that you might have already filled the survey",
        {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      console.error("Error submitting the survey:", error.message);
    }
  };

  return (
    <Sidebar>
      <section className="flex justify-center items-center mt-10">
        <div className=" w-full max-w-xs">
          <div>
            <h1 className="font-extrabold text-3xl uppercase text-center">
              Feedback
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="mx-auto mb-0 mt-8 space-y-4">
            <div>
              <label htmlFor="clientVisit" className="label text-md">
                Did the client visit the site?
              </label>
              <div className="flex justify-evenly lg:justify-between">
                <select
                  className="select select-bordered w-full max-w-xs"
                  value={visited}
                  onChange={handleVisitedChange}
                >
                  <option value="">Please select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              {visited === "Yes" && (
                <div>
                  <label htmlFor="bookedPlot" className="label text-md">
                    Did the client book the plot?
                  </label>
                  <select
                    className="select select-bordered w-full max-w-xs"
                    value={booked}
                    onChange={handleBookedChange}
                  >
                    <option value="">Please select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {booked === "Yes" && (
                    <div>
                      <label htmlFor="amountReserved" className="label text-md">
                        How much money was reserved in KES?
                      </label>
                      <input
                        type="number"
                        id="amountReserved"
                        value={amountReserved}
                        onChange={(e) => setAmountReserved(e.target.value)}
                        className="input input-bordered w-full max-w-xs"
                        placeholder="100000"
                      />
                      <label htmlFor="plotDetails" className="label text-md">
                        What are the details of the plot that they reserved?
                      </label>
                      <textarea
                        type="text"
                        id="plotDetails"
                        value={plotDetails}
                        onChange={(e) => setPlotDetails(e.target.value)}
                        className="textarea textarea-bordered h-24 w-full max-w-xs"
                      />
                    </div>
                  )}
                  {booked === "No" && (
                    <div>
                      <label
                        htmlFor="reasonNotBooked"
                        className="label text-md"
                      >
                        Why did the client NOT book a plot?
                      </label>
                      <textarea
                        type="text"
                        id="reasonNotBooked"
                        value={reasonNotBooked}
                        onChange={(e) => setReasonNotBooked(e.target.value)}
                        className="textarea textarea-bordered w-full max-w-xs"
                      />
                    </div>
                  )}
                </div>
              )}
              {visited === "No" && (
                <div>
                  <label htmlFor="reasonNoVisit" className="label text-md">
                    Why did the client not visit the site?
                  </label>
                  <textarea
                    id="reasonNoVisit"
                    value={reasonNoVisit}
                    onChange={(e) => setReasonNoVisit(e.target.value)}
                    className="textarea textarea-bordered h-24 w-full max-w-xs"
                  />
                </div>
              )}
              <button
                className="btn btn-primary w-full max-w-xs mt-2 text-white"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>
    </Sidebar>
  );
};

export default Survey;
