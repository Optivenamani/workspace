import React from "react";

const FormStep = ({ stepIndex, formData, setFormData, validateForm, onNext, children }) => {
    const isLastStep = stepIndex === React.Children.count(children) - 1;
    const isFirstStep = stepIndex === 0;
  
    const handleNext = () => {
      if (validateForm()) {
        onNext(); // Call the onNext function provided by the parent component
        if (!isLastStep) {
          // Navigate to the next step only if it's not the last step
          setStepIndex((currentIndex) => currentIndex + 1);
        }
      }
    };
  
    const handleBack = () => {
      if (stepIndex > 0) {
        // Navigate to the previous step only if it's not the first step
        setStepIndex((currentIndex) => currentIndex - 1);
      }
    };

  return (
    <>
      {React.Children.toArray(children)[stepIndex]}
      <div className="footer">
        <div className="flex justify-center mt-5">
          {!isFirstStep && (
            <button
              onClick={handleBack}
              className="mx-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              {/* ... existing previous button icon ... */}
            </button>
          )}

          {!isLastStep && (
            <button
              disabled={!validateForm()}
              onClick={handleNext}
              className="mx-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              {/* ... existing next button icon ... */}
            </button>
          )}
        </div>
        {isLastStep && validateForm() && (
          <div className="flex justify-center mt-5">
            <button
              className="btn btn-primary btn-outline"
              onClick={handleNext}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default FormStep;
