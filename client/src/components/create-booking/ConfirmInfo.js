import React, { useState } from "react";

const ConfirmInfo = ({ onSubmitForm, formData }) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <>
      <div className="flex flex-col mx-4">
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
          <h1>
            <span className="font-bold">Clients:</span>
            {formData.clients ? (
              <ol>
                {formData.clients.map((client, index) => (
                  <li key={index} className="italic font-serif">
                    {`${index+1}. ${client.clientFirstName || "First name not provided /"} ${client.clientLastName || "Last name not provided"}, ${client.clientPhoneNumber || "Phone not provided"}, ${client.clientEmail || "Email not provided" }`}
                  </li>
                ))}
              </ol>
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
