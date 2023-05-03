import React, { useState } from "react";

const Survey = () => {
  const [visited, setVisited] = useState("");
  const [booked, setBooked] = useState("");
  const [amountReserved, setAmountReserved] = useState("");
  const [plotDetails, setPlotDetails] = useState("");
  const [reasonNotBooked, setReasonNotBooked] = useState("");
  const [reasonNoVisit, setReasonNoVisit] = useState("");

  const handleVisitedChange = (event) => {
    setVisited(event.target.value);
    setBooked("");
    setAmountReserved("");
    setPlotDetails("");
    setReasonNotBooked("");
    setReasonNoVisit("");
  };

  const handleBookedChange = (event) => {
    setBooked(event.target.value);
    setAmountReserved("");
    setPlotDetails("");
    setReasonNotBooked("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({
      visited,
      booked,
      amountReserved,
      plotDetails,
      reasonNotBooked,
      reasonNoVisit,
    });
  };

  return (
    <section className="flex justify-center items-center mt-10">
      <div className=" w-full max-w-xs">
        <div>
          <h1 className="font-extrabold text-3xl uppercase text-center">
            Feedback
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="mx-auto mb-0 mt-8 space-y-4">
          <div>
            <label htmlFor="clientVisit" className="label text-sm">
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
                <label htmlFor="bookedPlot" className="label text-sm">
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
                    <label htmlFor="amountReserved" className="label text-sm">
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
                    <label htmlFor="plotDetails" className="label text-sm">
                      What are the details of the plot that he reserved?
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
                    <label htmlFor="reasonNotBooked" className="label text-sm">
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
                <label htmlFor="reasonNoVisit" className="label text-sm">
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
  );
};

export default Survey;
