import React from "react";

const ClientInfo = ({ formData, setFormData }) => {
  return (
    <>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text font-bold">Client Name</span>
        </label>
        <input
          type="text"
          placeholder="John Smith"
          className="input input-bordered w-full max-w-xs"
          value={formData.clientName}
          onChange={(e) =>
            setFormData({ ...formData, clientName: e.target.value })
          }
        />
        <label className="label">
          <span className="label-text font-bold">Client Email</span>
        </label>
        <input
          type="email"
          placeholder="john@mail.com"
          className="input input-bordered w-full max-w-xs"
          value={formData.clientEmail}
          onChange={(e) =>
            setFormData({ ...formData, clientEmail: e.target.value })
          }
        />
        <label className="label">
          <span className="label-text font-bold">Client Phone Number</span>
        </label>
        <input
          type="tel"
          placeholder="+254712345678"
          className="input input-bordered w-full max-w-xs"
          value={formData.clientPhoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, clientPhoneNumber: e.target.value })
          }
        />
      </div>
    </>
  );
};

export default ClientInfo;
