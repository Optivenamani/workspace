import React, { useState } from "react";
import IntervieweeInfo from "./IntervieweeInfo";
import PositionInfo from "./PositionInfo";
import ConfirmInterviewInfo from "./ConfirmInterviewInfo";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InterviewForm = () => {
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState({
    position: "",
    interviewDate: "",
    interviewees: [],
  });

  const formTitles = [
    "Position and Interview Date",
    "Interviewee Info",
    "Confirm Interview Details",
  ];

  const handleNext = () => {
    setPage((currentPage) => currentPage + 1);
  };

  const handleFormSubmit = async () => {
        try {
         
          const response = await fetch('http://localhost:8080/api/interviews', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
      
          // Check if the response is successful (status code 2xx).
          if (response.ok) {
            // Display a success message or redirect the user to another page
            toast.success("Interview form submitted successfully!", {
              position: "top-center",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
      
            // Reset the form data and navigate to the first page
            setFormData({
              position: "",
              interviewDate: "",
              interviewees: [],
            });
            setPage(0);
          } else {
            // Handle error cases where the server returned an error response
            const errorData = await response.json();
            // Display the error message to the user or handle it accordingly
            toast.error(errorData.message || "Error submitting interview form. Please try again.", {
              position: "top-center",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        } catch (error) {
          // Handle any network errors or exceptions that occurred during the API call
          toast.error("Error submitting interview form. Please try again.", {
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
      return formData.position && formData.interviewDate;
    } else if (page === 1) {
      return formData.interviewees.every(
        (interviewee) => interviewee.name && interviewee.email
      );
    }
    return true; // Allow submission from ConfirmInterviewInfo step
  };

  const renderStep = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <PositionInfo
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <IntervieweeInfo
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <ConfirmInterviewInfo
            formData={formData}
            setFormData={setFormData}
            onSubmitForm={handleFormSubmit}
            validateForm={validateForm}
          />
        );
      default:
        return null;
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
        <div className="flex justify-center">{renderStep(page)}</div>
        <div className="footer">
          <div className="flex justify-center mt-5">
            {page === 0 ? null : (
              <button
                disabled={page === 0}
                onClick={() => setPage((currentPage) => currentPage - 1)}
                className="mx-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                {/* ... existing previous button icon ... */}
              </button>
            )}

            {page === formTitles.length - 1 ? null : (
              <button
                disabled={!validateForm()}
                onClick={() => setPage((currentPage) => currentPage + 1)}
                className="mx-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                {/* ... existing next button icon ... */}
              </button>
            )}
          </div>
          {page === formTitles.length - 1 && validateForm() && (
            <div className="flex justify-center mt-5">
              <button
                className="btn btn-primary btn-outline"
                onClick={handleFormSubmit}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewForm;
