import React from "react";
import { Link } from "react-router-dom";

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
        <Link
          to="#"
          className="text-primary text-center italic mt-4 hover:underline"
        >
          Got more than one client?
        </Link>
      </div>
    </>
  );
};

export default ClientInfo;
