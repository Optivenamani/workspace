import React, { useState } from "react";

function ClientInfo({ formData, setFormData }) {
  const [clients, setClients] = useState(
    formData.clients.length > 0
      ? formData.clients
      : [
          {
            clientFirstName: "",
            clientLastName: "",
            clientEmail: "",
            clientPhoneNumber: "",
          },
        ]
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
          className="flex flex-wrap justify-center md:grid md:grid-cols-2 lg:flex lg:flex-nowrap lg:items-center gap-4"
        >
          <div className="mx-2 w-full">
            <label className="label">
              <span className="label-text font-bold">First Name</span>
            </label>
            <input
              type="text"
              name="clientFirstName"
              value={client.clientFirstName || ""}
              onChange={(event) => handleInputChange(event, index)}
              placeholder="Jim"
              className="input input-bordered w-full"
            />
          </div>
          <div className="mx-2 w-full">
            <label className="label">
              <span className="label-text font-bold">Last Name</span>
            </label>
            <input
              type="text"
              name="clientLastName"
              value={client.clientLastName || ""}
              onChange={(event) => handleInputChange(event, index)}
              placeholder="Halpert"
              className="input input-bordered w-full"
            />
          </div>
          <div className="mx-2 w-full">
            <label className="label">
              <span className="label-text font-bold">Email</span>
            </label>
            <input
              type="clientEmail"
              name="clientEmail"
              value={client.clientEmail || ""}
              onChange={(event) => handleInputChange(event, index)}
              placeholder="jim@mail.com"
              className="input input-bordered w-full"
            />
          </div>
          <div className="mx-2 w-full">
            <label className="label">
              <span className="label-text font-bold">Phone Number</span>
            </label>
            <input
              type="tel"
              name="clientPhoneNumber"
              value={client.clientPhoneNumber || ""}
              onChange={(event) => handleInputChange(event, index)}
              placeholder="+2547XXXXXXXX"
              className="input input-bordered w-full"
            />
          </div>
          {clients.length > 1 && (
            <div className="mx-2 mt-2 md:mt-0 lg:mt-8">
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
        className="btn btn-primary btn-outline mx-2 my-4"
      >
        Add Another Client
      </button>
    </div>
  );
}

export default ClientInfo;
