import React, { useState } from "react";
import SiteVisitInfo from "./SiteVisitInfo";
import ClientInfo from "./ClientInfo";
import ConfirmInfo from "./ConfirmInfo";

const Form = () => {
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState({
    site: "",
    pickupLocation: "",
    date: "",
    time: "",
    clients: [],
  });

  const formTitles = [
    "Site Visit Request Info",
    "Client Info",
    "Confirm Details",
  ];

  const handleFormSubmit = (event, data) => {
    event.preventDefault();
    console.log(data)
  };

  const pageDisplay = () => {
    if (page === 0) {
      return <SiteVisitInfo formData={formData} setFormData={setFormData} />;
    } else if (page === 1) {
      return <ClientInfo formData={formData} setFormData={setFormData} />;
    } else if (page === 2) {
      return (
        <ConfirmInfo
          formData={formData}
          setFormData={setFormData}
          onSubmitForm={handleFormSubmit}
        />
      );
    }
  };

  return (
    <div className="my-10">
      <div className="flex justify-center my-4">
        <progress
          className="progress progress-primary w-56"
          value={((page + 1) / formTitles.length) * 100}
          max="100"
        ></progress>
      </div>
      <div className="form-container">
        {/* <div className="text-center p-4 text-2xl font-bold uppercase">
          {formTitles[page]}
        </div> */}
        <div className="flex justify-center">{pageDisplay()}</div>
        <div className="footer"></div>
        <div className="flex justify-center mt-5">
          {page === 0 ? null : (
            <button
              disabled={page === 0}
              onClick={() => {
                setPage((currentPage) => currentPage - 1);
              }}
              className="mx-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <svg
                className="h-6 w-6 text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
          )}

          {page === formTitles.length - 1 ? null : (
            <button
              disabled={page === formTitles.length - 1}
              onClick={() => {
                if (page === formTitles.length - 1) {
                  alert("FORM SUBMITTED");
                  console.log("formData");
                } else {
                  setPage((currentPage) => currentPage + 1);
                }
              }}
              className="mx-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <svg
                className="h-6 w-6 text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Form;
