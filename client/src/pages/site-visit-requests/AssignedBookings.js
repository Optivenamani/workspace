import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import formatTime from "../../utils/formatTime";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import huh from "../../assets/app-illustrations/Shrug-bro.png";

const AssignedBookings = () => {
  const [siteVisits, setSiteVisits] = useState([]);
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(
          "https://workspace.optiven.co.ke/api/drivers/assigned-site-visits",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setSiteVisits(data);
      } catch (error) {
        console.error("Error fetching site visits:", error);
      }
    };
    
    fetchTrips();
  }, [token]);
  console.log(siteVisits)

  const startTrip = async (id) => {
    try {
      const response = await fetch(
        `https://workspace.optiven.co.ke/api/site-visits/start-trip/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedSiteVisits = siteVisits.map((sv) =>
          sv.id === id ? { ...sv, status: "in_progress" } : sv
        );
        setSiteVisits(updatedSiteVisits);
        toast.success("Trip set to in progress.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        const data = await response.json();
        toast.error("An error occurred while attempting to start trip.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error("Error starting trip:", data.message);
      }
    } catch (error) {
      toast.error("An error occurred while attempting to start trip.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error starting trip:", error);
    }
  };

  const endTrip = async (id) => {
    try {
      const response = await fetch(
        `https://workspace.optiven.co.ke/api/site-visits/end-trip/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedSiteVisits = siteVisits.filter((sv) => sv.id !== id);
        setSiteVisits(updatedSiteVisits);
        toast.success("Trip set to complete.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        const data = await response.json();
        toast.error("An error occurred while attempting to end trip.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error("Error ending trip:", data.message);
      }
    } catch (error) {
      toast.error("An error occurred while attempting to end trip.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error ending trip:", error);
    }
  };

  return (
    <>
      <Sidebar>
        <div className="flex justify-center">
          <div className="container px-4 py-6">
            {siteVisits.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {siteVisits.map((sv, i) => (
                  <div
                    key={sv.id}
                    className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8"
                  >
                    <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

                    <div className="sm:flex sm:justify-between sm:gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                          {sv.pickup_location}
                        </h3>
                        <p className="mt-1 text-xs font-medium text-gray-600">
                          <span className="font-bold">Site Name: </span>{" "}
                          {sv.site_name}
                        </p>
                        <p className="mt-1 text-xs font-medium text-gray-600">
                          <span className="font-bold">Marketer Name: </span>{" "}
                          {sv.marketer_name}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="max-w-[40ch] text-sm">
                        <span className="font-bold">Passengers: </span>
                        {sv.total_passengers}
                      </p>
                    </div>

                    <dl className="mt-6 flex gap-4 sm:gap-6">
                      <div className="flex flex-col-reverse">
                        <dt className="text-sm font-medium text-gray-600">
                          {new Date(sv.pickup_date).toLocaleDateString("en-GB")}
                        </dt>
                        <dd className="text-xs font-bold">Pickup Date</dd>
                      </div>

                      <div className="flex flex-col-reverse">
                        <dt className="text-sm font-medium text-gray-600">
                          {formatTime(sv.pickup_time)}
                        </dt>
                        <dd className="text-xs font-bold">Pickup Time</dd>
                      </div>

                      <div className="flex flex-col-reverse">
                        <button
                          className={`btn ${
                            sv.status === "in_progress"
                              ? "btn-error"
                              : "btn-primary"
                          } text-white`}
                          onClick={() =>
                            sv.status === "in_progress"
                              ? endTrip(sv.id)
                              : startTrip(sv.id)
                          }
                        >
                          {sv.status === "in_progress"
                            ? "End Trip"
                            : "Start Trip"}
                        </button>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="flex flex-col items-center mt-20">
                  <img src={huh} alt="huh" className="lg:w-96" />
                  <h1 className="font-bold text-center">
                    No assigned site visit trips available. Check back later.
                  </h1>
                </div>
              </div>
            )}
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default AssignedBookings;
