import React, { useState } from "react";

const ConfirmInfo = ({ onSubmitForm, formData }) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <>
      <div className="flex flex-col">
        <div className="card rounded bg-base-100 shadow-xl p-10 my-4">
          <h1>
            <span className="font-bold">Site: </span>
            {formData.site ? (
              formData.site
            ) : (
              <span className="italic">Not Provided</span>
            )}
          </h1>
          <h1>
            <span className="font-bold">Pickup Location: </span>
            {formData.pickupLocation ? (
              formData.pickupLocation
            ) : (
              <span className="italic">Not Provided</span>
            )}
          </h1>
          <h1>
            <span className="font-bold">Date (YYYY-MM-DD): </span>
            {formData.date ? (
              formData.date
            ) : (
              <span className="italic">Not Provided</span>
            )}
          </h1>
          <h1>
            <span className="font-bold">Time (24H): </span>
            {formData.time ? (
              formData.time
            ) : (
              <span className="italic">Not Provided</span>
            )}
          </h1>
          {/* <h1>
            <span className="font-bold">Client Name: </span>
            {formData.clientName ? (
              formData.clientName
            ) : (
              <span className="italic">Not Provided</span>
            )}
          </h1>
          <h1>
            <span className="font-bold">Client Email: </span>
            {formData.clientEmail ? (
              formData.clientEmail
            ) : (
              <span className="italic">Not Provided</span>
            )}
          </h1>
          <h1>
            <span className="font-bold">Client Phone Number: </span>
            {formData.clientPhoneNumber ? (
              formData.clientPhoneNumber
            ) : (
              <span className="italic">Not Provided</span>
            )}
          </h1> */}
          <h1>
            <span className="font-bold">Clients: </span>
            {formData.clientName ? (
              formData.clientName
            ) : (
              <span className="italic">Not Provided</span>
            )}
          </h1>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            className="checkbox mr-2"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />

          <p>The info provided above is correct</p>
        </div>
        <button
          className="btn btn-primary btn-outline mt-4"
          onClick={onSubmitForm}
          disabled={isChecked === false}
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default ConfirmInfo;
