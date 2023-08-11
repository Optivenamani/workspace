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

  const handlePrevious = () => {
    setPage((currentPage) => currentPage - 1);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...formData.interviewees];
    list[index][name] = value;
    setFormData({ ...formData, interviewees: list });
  };

  const handleAddInterviewee = () => {
    setFormData({
      ...formData,
      interviewees: [
        ...formData.interviewees,
        { name: "", email: "", phone: "", interviewTime: "" },
      ],
    });
  };

  const handleRemoveInterviewee = (index) => {
    const list = [...formData.interviewees];
    list.splice(index, 1);
    setFormData({ ...formData, interviewees: list });
  };

  const handleFormSubmit = async () => {
    // Get the token from the storage
    const accessToken = localStorage.getItem("token");
  
    // Prepare the form data, adjusting phone numbers as necessary.
    const intervieweesWithAdjustedPhoneNumbers = formData.interviewees.map(
      (interviewee) => {
        let phoneNumber = interviewee.phone;
        if (phoneNumber.charAt(0) === "+") {
          phoneNumber = phoneNumber.substring(1);
        }
        return {
          ...interviewee,
          phone: phoneNumber,
        };
      }
    );
  
    // Add the interviewees data to formData before sending it to the server
    const completeFormData = {
      position: formData.position,
      interviewDate: formData.interviewDate,
      interviewees: intervieweesWithAdjustedPhoneNumbers,
    };

    try {
      // Send the form data to the server
      const response = await fetch("http://localhost:8080/api/interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(completeFormData),
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
        toast.error(
          errorData.message || "Error submitting interview form. Please try again.",
          {
            position: "top-center",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
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
      return formData.position.trim() !== "" && formData.interviewDate.trim() !== "";
    } else if (page === 1) {
      return formData.interviewees.every(
        (interviewee) => interviewee.name.trim() !== "" && interviewee.email.trim() !== ""
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
            handleInputChange={handleInputChange}
            handleAddInterviewee={handleAddInterviewee}
            handleRemoveInterviewee={handleRemoveInterviewee}
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
                onClick={handlePrevious}
                className="mx-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                {/* ... existing previous button icon ... */}
              </button>
            )}

            {page === formTitles.length - 1 ? null : (
              <button
                disabled={!validateForm()}
                onClick={handleNext}
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
