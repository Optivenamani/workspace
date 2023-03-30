import React, { useState } from "react";

function ClientInfo({ formData, setFormData }) {
  const [clients, setClients] = useState(
    formData.clients || [{ clientFirstName: "", clientLastName: "", clientEmail: "", clientPhoneNumber: "" }]
  );

  function handleInputChange(event, index) {
    const { name, value } = event.target;
    const list = [...clients];
    list[index][name] = value;
    setClients(list);
    setFormData({ ...formData, clients: list });
  }

  function handleAddClient() {
    setClients([
      ...clients,
      { clientFirstName: "", clientLastName: "", clientEmail: "", clientPhoneNumber: "" },
    ]);
  }

  function handleRemoveClient(index) {
    const list = [...clients];
    list.splice(index, 1);
    setClients(list);
    setFormData({ ...formData, clients: list });
  }

  return (
    <div>
      {clients.map((client, index) => (
        <div
          key={index}
          className="flex flex-col items-center md:flex-row lg:flex-row"
        >
          <div className="mx-2">
            <label className="label">
              <span className="label-text font-bold">First Name</span>
            </label>
            <input
              type="text"
              name="clientFirstName"
              value={client.clientFirstName || ""}
              onChange={(event) => handleInputChange(event, index)}
              placeholder="Jim"
              className="input input-bordered"
            />
          </div>
          <div className="mx-2">
            <label className="label">
              <span className="label-text font-bold">Last Name</span>
            </label>
            <input
              type="text"
              name="clientLastName"
              value={client.clientLastName || ""}
              onChange={(event) => handleInputChange(event, index)}
              placeholder="Halpert"
              className="input input-bordered"
            />
          </div>
          <div className="mx-2">
            <label className="label">
              <span className="label-text font-bold">Email</span>
            </label>
            <input
              type="clientEmail"
              name="clientEmail"
              value={client.clientEmail || ""}
              onChange={(event) => handleInputChange(event, index)}
              placeholder="jim@mail.com"
              className="input input-bordered"
            />
          </div>
          <div className="mx-2">
            <label className="label">
              <span className="label-text font-bold">Phone Number</span>
            </label>
            <input
              type="tel"
              name="clientPhoneNumber"
              value={client.clientPhoneNumber || ""}
              onChange={(event) => handleInputChange(event, index)}
              placeholder="+2547XXXXXXXX"
              className="input input-bordered"
            />
          </div>
          {clients.length > 1 && (
            <div className="mx-2 mt-2 lg:mx-2 lg:mt-8">
              <button
                onClick={() => handleRemoveClient(index)}
                className="btn text-white btn-error"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
      <button
        onClick={handleAddClient}
        className=" btn btn-primary btn-outline mx-2 my-4"
      >
        Add Client
      </button>
    </div>
  );
}

export default ClientInfo;
