import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../../components/Sidebar";
import huh from "../../../assets/app-illustrations/Shrug-bro.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import formatTime from "../../../utils/formatTime";
import formatDate from "../../../utils/formatDate";

const AssignedSpecialAssignments = () => {
  const [specialAssignments, setSpecialAssignments] = useState([]);
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchSpecialAssignments = async () => {
      try {
        const response = await fetch(
          "https://workspace.optiven.co.ke/api/drivers/assigned-special-assignments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setSpecialAssignments(data);
      } catch (error) {
        console.error("Error fetching special assignments:", error);
      }
    };

    fetchSpecialAssignments();
  }, [token]);

  const startTrip = async (id) => {
    try {
      const response = await fetch(
        `https://workspace.optiven.co.ke/api/special-assignments/start-trip/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedSpecialAssignments = specialAssignments.map((assignment) =>
          assignment.id === id
            ? { ...assignment, status: "in_progress" }
            : assignment
        );
        setSpecialAssignments(updatedSpecialAssignments);
        toast.success("Trip set to in progress.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.log("Trip started successfully");
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
        `https://workspace.optiven.co.ke/api/special-assignments/end-trip/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedSpecialAssignments = specialAssignments.filter(
          (assignment) => assignment.id !== id
        );
        setSpecialAssignments(updatedSpecialAssignments);
        toast.success("Trip set to complete.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.log("Trip ended successfully");
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
            {specialAssignments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {specialAssignments.map((assignment, i) => (
                  <div
                    key={assignment.id}
                    className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8"
                  >
                    <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

                    <div className="sm:flex sm:justify-between sm:gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                          Destination: {assignment.destination}
                        </h3>
                        <p className="mt-1 text-xs font-medium text-gray-600">
                          <span className="font-bold"> Pickup Date: </span>{" "}
                          {formatDate(assignment.reservation_date)}
                        </p>
                        <p className="mt-1 text-xs font-medium text-gray-600">
                          <span className="font-bold"> Pickup Time: </span>{" "}
                          {formatTime(assignment.reservation_time)}
                        </p>
                        <p className="mt-1 text-xs font-medium text-gray-600">
                          <span className="font-bold">Pickup Location: </span>{" "}
                          {assignment.pickup_location}
                        </p>
                        <p className="mt-1 text-xs font-medium text-gray-600">
                          <span className="font-bold">Reason: </span>{" "}
                          {assignment.reason}
                        </p>
                        <p className="mt-1 text-xs font-medium text-gray-600">
                          <span className="font-bold">Remarks: </span>{" "}
                          {assignment.remarks}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col-reverse mt-2">
                      <button
                        className={`btn ${
                          assignment.status === "in_progress"
                            ? "btn-error"
                            : "btn-primary"
                        } text-white`}
                        onClick={() =>
                          assignment.status === "in_progress"
                            ? endTrip(assignment.id)
                            : startTrip(assignment.id)
                        }
                      >
                        {assignment.status === "in_progress"
                          ? "End Trip"
                          : "Start Trip"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="flex flex-col items-center mt-20">
                  <img src={huh} alt="huh" className="lg:w-96" />
                  <h1 className="font-bold text-center">
                    No assigned special assignments available. Check back later.
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

export default AssignedSpecialAssignments;
