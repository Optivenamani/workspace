import React from "react";
import Sidebar from "../components/Sidebar";

const Notifications = () => {
  return (
    <>
      <Sidebar>
        <div className="flex flex-col">
          <div className="mt-6 mb-6 flex justify-center">
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          </div>
          <div className="flex flex-col items-center justify-center px-3">
            <div className="flex flex-col space-y-4">
              <div className="bg-white shadow-lg rounded-md p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-500 mr-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 12l-5 5m0 0l-5-5m5 5V6"
                    />
                  </svg>
                  <div>
                    <p className="text-gray-800 font-medium">
                      Site Visit Booking Request Sent
                    </p>
                    <p className="text-gray-600 italic text-sm">
                      Your application has been submitted successfully.
                    </p>
                  </div>
                </div>
                <div className="text-gray-500 text-sm">
                  <p>2 hours ago</p>
                </div>
              </div>
              <div className="bg-white shadow-lg rounded-md p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-500 mr-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <div>
                    <p className="text-gray-800 font-medium">Site Visit Booking Accepted!</p>
                    <p className="text-gray-600 italic text-sm">
                      Your site visit booking request has been accepted.
                    </p>
                  </div>
                </div>
                <div className="text-gray-500 text-sm">
                  <p>3 hours ago</p>
                </div>
              </div>
              <div className="bg-white shadow-lg rounded-md p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-500 mr-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <div>
                    <p className="text-gray-800 font-medium">
                      Site Visit Complete
                    </p>
                    <p className="text-gray-600 italic text-sm">
                      Your site visit has been marked as complete.
                    </p>
                  </div>
                </div>
                <div className="text-gray-500 text-sm">
                  <p>5 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default Notifications;
