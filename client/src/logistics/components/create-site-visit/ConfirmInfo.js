import React, { useState } from "react";
import formatTime from "../../../utils/formatTime";

const ConfirmInfo = ({ onSubmitForm, formData }) => {
  const [isChecked, setIsChecked] = useState(false);

  const clientsArrayLength = formData.clients.length;

  return (
    <>
      <div className="flex flex-col mx-4">
        <div className="card rounded bg-base-100 shadow-xl p-10 my-4">
          <h1>
            <span className="font-bold">Site: </span>
            {formData.site_name ? (
              formData.site_name
            ) : (
              <span className="italic">Not Provided</span>
            )}
          </h1>
          <h1>
            <span className="font-bold">Pickup Location: </span>
            {formData.pickup_location ? (
              formData.pickup_location
            ) : (
              <span className="italic">Not Provided</span>
            )}
          </h1>
          <h1>
            <span className="font-bold">Date (DD/MM/YYYY): </span>
            {formData.pickup_date ? (
              new Date(formData.pickup_date).toLocaleDateString("en-GB")
            ) : (
              <span className="italic">Not Provided</span>
            )}
          </h1>
          <h1>
            <span className="font-bold">Time: </span>
            {formData.pickup_time ? (
              formatTime(formData.pickup_time)
            ) : (
              <span className="italic">Not Provided</span>
            )}
          </h1>
          <h1>
            <span className="font-bold">Clients:</span>
            {formData.clients ? (
              <ol>
                {formData.clients
                  .filter(
                    (client) =>
                      client.name || client.phone_number || client.email
                  )
                  .map((client, index) => (
                    <li key={index} className="italic font-serif">
                      {`${index + 1}. ${client.name || "Name not provided"}, ${
                        client.phone_number || "Phone not provided"
                      }, ${client.email || "Email not provided"}`}
                    </li>
                  ))}
              </ol>
            ) : (
              <span className="italic">Not Provided</span>
            )}
          </h1>
        </div>
        {clientsArrayLength !== 0 && (
          <div className="flex items-center">
            <input
              type="checkbox"
              className="checkbox mr-2"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />

            <p className="font-bold italic">
              The info provided above is correct
            </p>
          </div>
        )}
        <button
          className="btn btn-primary btn-outline mt-4"
          onClick={onSubmitForm}
          disabled={isChecked === false || clientsArrayLength === 0}
        >
          Submit
        </button>
        {clientsArrayLength === 0 ? (
          <span className="text-sm text-red-500 font-bold italic mt-2">
            You haven't placed any clients
          </span>
        ) : null}
      </div>
    </>
  );
};

export default ConfirmInfo;
