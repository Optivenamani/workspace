import React from "react";

const ConfirmInterviewInfo = ({ formData }) => {
  return (
    <>
      <div className="form-control w-full max-w-xs">
        <h2 className="text-2xl font-bold mb-4">Confirm Interview Details</h2>
        <div>
          <p>
            <span className="font-bold">Position:</span> {formData.position}
          </p>
          <p>
            <span className="font-bold">Interview Date:</span>{" "}
            {formData.interviewDate}
          </p>
        </div>
        <h2 className="text-2xl font-bold mt-6">Interviewees:</h2>
        {formData.interviewees.map((interviewee, index) => (
          <div key={index} className="my-4">
            <p>
              <span className="font-bold">Name:</span> {interviewee.name}
            </p>
            <p>
              <span className="font-bold">Email:</span> {interviewee.email}
            </p>
            <p>
              <span className="font-bold">Phone:</span> {interviewee.phone}
            </p>
            <p>
              <span className="font-bold">Interview Time:</span>{" "}
              {interviewee.interviewTime}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ConfirmInterviewInfo;
