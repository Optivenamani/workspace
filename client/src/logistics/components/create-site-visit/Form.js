import React, { useState } from "react";
import SiteVisitInfo from "./SiteVisitInfo";
import ClientInfo from "./ClientInfo";
import ConfirmInfo from "./ConfirmInfo";
import { createSiteVisitRequest } from "./api/api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Form = () => {
  const user = useSelector((state) => state.user.user);
  const marketer_id = user.user_id;

  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState({
    marketer_id: marketer_id,
    project_id: "",
    site_name: "",
    pickup_location: "",
    pickup_date: "",
    pickup_time: "",
    clients: [],
  });

  const navigate = useNavigate();

  const formTitles = ["Site Visit Info", "Client Info", "Confirm Details"];

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Get the token from the storage
    const token = localStorage.getItem("token");

    // Prepare the form data, adjusting phone numbers as necessary.
    const clientsWithAdjustedPhoneNumbers = formData.clients.map((client) => {
      let phoneNumber = client.phone_number;
      if (phoneNumber.charAt(0) === "+") {
        phoneNumber = phoneNumber.substring(1);
      }
      return {
        ...client,
        phone_number: phoneNumber,
      };
    });

    // Add the marketer_id to formData before sending it to the server
    const completeFormData = {
      ...formData,
      marketer_id,
      clients: clientsWithAdjustedPhoneNumbers,
    };

    try {
      // Send the form data to the server
      await createSiteVisitRequest(completeFormData, token);

      // Clear the form data and reset the form
      setFormData({
        site_name: "",
        pickup_location: "",
        pickup_date: "",
        pickup_time: "",
        clients: [],
      });
      setPage(0);

      // Display a success message or redirect the user to another page
      toast.success("Site visit request created successfully!", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate("/logistics-home");
    } catch (error) {
      // Display an error message
      toast.error("Error creating site visit request. Please try again.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const validateForm = () => {
    if (page === 0) {
      return (
        formData.project_id &&
        formData.site_name &&
        formData.pickup_location &&
        formData.pickup_date &&
        formData.pickup_time
      );
    } else if (page === 1) {
      return formData.clients.every((client) => {
        return client.name && client.phone_number;
      });
    }
    return false;
  };

  const pageDisplay = () => {
    if (page === 0) {
      return (
        <SiteVisitInfo
          formData={formData}
          setFormData={setFormData}
          validateForm={validateForm}
        />
      );
    } else if (page === 1) {
      return (
        <ClientInfo
          formData={formData}
          setFormData={setFormData}
          validateForm={validateForm}
        />
      );
    } else if (page === 2) {
      return (
        <ConfirmInfo
          formData={formData}
          setFormData={setFormData}
          onSubmitForm={handleFormSubmit}
          validateForm={validateForm}
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
        <div className="text-center p-4 text-2xl font-bold uppercase">
          {formTitles[page]}
        </div>
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
                if (validateForm()) {
                  setPage((currentPage) => currentPage + 1);
                } else {
                  toast.error(
                    "Please fill in all required fields before proceeding.",
                    {
                      position: "top-center",
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    }
                  );
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
