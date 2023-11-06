import React, { useState, useCallback, useEffect, useMemo } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "../../../foundation/components/Sidebar";
import { useSelector } from "react-redux";
import axios from "axios";

const ViewEvents = () => {
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventAmount, setEventAmount] = useState("");
  const [pillar, setPillar] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [searchQuery, setSearchQuery] = useState("");

  const token = useSelector((state) => state.user.token);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const event = {
      event_name: eventName,
      event_location: eventLocation,
      event_amount: eventAmount,
      pillar: pillar,
    };

    try {
      const response = await fetch("http://localhost:8080/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(event),
      });

      setLoading(false);
      closeModal();

      setEventName("");
      setEventLocation("");
      setEventAmount("");
      setPillar("");

      // Display success notification
      toast.success("events added successfully!", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      // Display error notification
      toast.error(error, {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    // Make a GET request to the server endpoint to download the template
    axios({
      url: "http://localhost:8080/api/events/download-template", // Replace with your server endpoint
      method: "GET",
      responseType: "blob", // Important: responseType must be 'blob' for binary data
    })
      .then((response) => {
        // Create a blob from the binary data and create a download link
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "template.xlsx"; // Specify the default download file name
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url); // Clean up the URL object after the download
      })
      .catch((error) => {
        toast.error("Error downloading Excel Sheet", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  const filteredEvents = useMemo(() => {
    return events.filter((item) => {
      if (searchQuery === "") {
        return true; // Include all items when the search query is empty
      } else if (
        item.event_name &&
        item.event_name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return true; // Include the item if it matches the search query
      } else {
        return false; // Exclude the item if it doesn't match the search query
      }
    });
  }, [searchQuery, events]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log("fetched data", data);

        const sortedData = data.sort((a, b) => {
          return b.id - a.id;
        });

        const filtered = sortedData.filter((item) => {
          if (selectedStatus === "all") {
            return true;
          } else if (selectedStatus === "health") {
            return item.pillar === "Health";
          } else if (selectedStatus === "environment") {
            return item.pillar === "Environment";
          } else if (selectedStatus === "poverty") {
            return item.pillar === "Poverty Alleviation";
          } else if (selectedStatus === "education") {
            return item.pillar === "Education";
          } else {
            return item.pillar === selectedStatus;
          }
        });

        setEvents(filtered);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvents();
  }, [token, selectedStatus]);

  let statusText = "";
  switch (selectedStatus) {
    case "all":
      break;
    case "health":
      break;
    case "environment":
      break;
    case "approved":
      break;
    case "poverty":
      break;
    case "education":
      break;
    default:
      break;
  }
  return (
    <Sidebar>
      <section className="container px-4 mx-auto">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-x-3">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                Events
              </h2>
              <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
                Welcome 😊
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
              These are all the Events have been planned.
              <br></br>
              <button
                onClick={downloadTemplate}
                className="mt-1 text-sm text-gray-500 dark:text-gray-300 text-start"
              >
                Please click below to
                <div className="underline">Download Excel Sheet</div>
              </button>
            </p>
          </div>
          <div className="flex items-center mt-4 gap-x-3">
            <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700">
              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_3098_154395)">
                  <path
                    d="M13.3333 13.3332L9.99997 9.9999M9.99997 9.9999L6.66663 13.3332M9.99997 9.9999V17.4999M16.9916 15.3249C17.8044 14.8818 18.4465 14.1806 18.8165 13.3321C19.1866 12.4835 19.2635 11.5359 19.0351 10.6388C18.8068 9.7417 18.2862 8.94616 17.5555 8.37778C16.8248 7.80939 15.9257 7.50052 15 7.4999H13.95C13.6977 6.52427 13.2276 5.61852 12.5749 4.85073C11.9222 4.08295 11.104 3.47311 10.1817 3.06708C9.25943 2.66104 8.25709 2.46937 7.25006 2.50647C6.24304 2.54358 5.25752 2.80849 4.36761 3.28129C3.47771 3.7541 2.70656 4.42249 2.11215 5.23622C1.51774 6.04996 1.11554 6.98785 0.935783 7.9794C0.756025 8.97095 0.803388 9.99035 1.07431 10.961C1.34523 11.9316 1.83267 12.8281 2.49997 13.5832"
                    stroke="currentColor"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3098_154395">
                    <rect width={20} height={20} fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span>Import Events</span>
            </button>
            <button
              className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600"
              onClick={() => setIsModalOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Add Event</span>
            </button>
            <Modal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              className="modal-box container mx-auto"
            >
              {" "}
              <button
                onClick={closeModal}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </button>
              {/* Add your form fields or other content here */}
              <div>
                <form onSubmit={handleSubmit}>
                  <label className="label font-bold text-xs">Add Event</label>
                  <label className="label font-bold text-xs">
                    Name of the Event
                  </label>
                  <input
                    className="input input-bordered w-full"
                    name="eventName"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    spellCheck
                    required
                  />
                  <label className="label font-bold text-xs">
                    Location of the Event
                  </label>
                  <input
                    className="input input-bordered w-full"
                    name="eventLocation"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    spellCheck
                    required
                  />
                  <label className="label font-bold text-xs">
                    Amount Required for the event
                  </label>
                  <input
                    className="input input-bordered w-full"
                    name="eventAmount"
                    value={eventAmount}
                    onChange={(e) => setEventAmount(e.target.value)}
                    typeof="number"
                    spellCheck
                    required
                    type="number"
                  />
                  <label className="label font-bold text-xs">
                    Pillar Supported by the event
                  </label>
                  <select
                    className="input input-bordered w-full"
                    name="pillar"
                    value={pillar}
                    onChange={(e) => setPillar(e.target.value)}
                    required
                  >
                    <option value="None Selected">Please select Pillar</option>
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                    <option value="Poverty Alleviation">
                      Poverty Alleviation
                    </option>
                    <option value="Environment">Environment</option>
                  </select>

                  <button
                    type="submit"
                    className="btn btn-outline my-4 w-full bg-green"
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </form>{" "}
              </div>
            </Modal>
          </div>
        </div>
        <div className="mt-6 md:flex md:items-center md:justify-between">
          <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
            <button
              className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:hover:bg-gray-200 dark:text-gray-300 hover:bg-gray-100
        ${selectedStatus === "all" ? "btn-active" : ""}`}
              onClick={() => setSelectedStatus("all")}
            >
              All
            </button>
            <div
              className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:hover:bg-gray-200 dark:text-gray-300 hover:bg-gray-100
        ${selectedStatus === "Education" ? "btn-active" : ""}`}
              onClick={() => setSelectedStatus("education")}
            >
              Education
            </div>
            <div
              className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:hover:bg-gray-200 dark:text-gray-300 hover:bg-gray-100
        ${selectedStatus === "Health" ? "btn-active" : ""}`}
              onClick={() => setSelectedStatus("health")}
            >
              Health
            </div>
            <button
              className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:hover:bg-gray-200 dark:text-gray-300 hover:bg-gray-100
        ${selectedStatus === "Environment" ? "btn-active" : ""}`}
              onClick={() => setSelectedStatus("environment")}
            >
              Environment
            </button>
            <button
              className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:hover:bg-gray-200 dark:text-gray-300 hover:bg-gray-100
        ${selectedStatus === "Poverty" ? "btn-active" : ""}`}
              onClick={() => setSelectedStatus("poverty")}
            >
              Poverty Alleviation
            </button>
          </div>
          <div className="relative flex items-center mt-4 md:mt-0">
            <span className="absolute">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search"
              className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col mt-6">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        <button className="flex items-center gap-x-3 focus:outline-none">
                          <span>Name</span>
                          <svg
                            className="h-3"
                            viewBox="0 0 10 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="0.1"
                            />
                            <path
                              d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="0.1"
                            />
                            <path
                              d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="0.3"
                            />
                          </svg>
                        </button>
                      </th>
                      <th
                        scope="col"
                        className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Location
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Pillar
                      </th>
                      <th scope="col" className="relative py-3.5 px-4">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                    {filteredEvents.map((event, index) => (
                      <tr key={index}>
                        <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                          {event.event_name}
                        </td>
                        <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                          {event.event_location}
                        </td>
                        <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                          {event.event_amount}
                        </td>
                        <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                          <div className="inline px-3 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                            {event.pillar}
                          </div>
                        </td>
                        {/* Display more columns as needed */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 sm:flex sm:items-center sm:justify-between ">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Page{" "}
            <span className="font-medium text-gray-700 dark:text-gray-100">
              1 of 10
            </span>
          </div>
          <div className="flex items-center mt-4 gap-x-4 sm:mt-0">
            <a
              href="#"
              className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 rtl:-scale-x-100"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                />
              </svg>
              <span>previous</span>
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <span>Next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 rtl:-scale-x-100"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </Sidebar>
  );
};

export default ViewEvents;
