import React from "react";

const SiteVisitInfo = ({ formData, setFormData }) => {
  return (
    <>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text font-bold">Site</span>
        </label>
        <select
          className="select select-bordered w-full max-w-xs"
          value={formData.site}
          onChange={(e) => setFormData({ ...formData, site: e.target.value })}
        >
          <option>Site</option>
          <option>Ngong'</option>
          <option>Kitengela</option>
        </select>
        <label className="label">
          <span className="label-text font-bold">Pickup Location</span>
        </label>
        <select
          className="select select-bordered w-full max-w-xs"
          value={formData.pickupLocation}
          onChange={(e) =>
            setFormData({ ...formData, pickupLocation: e.target.value })
          }
        >
          <option>Pickup Location</option>
          <option>ABSA Towers</option>
          <option>Karen Global Office</option>
        </select>
        <label className="label">
          <span className="label-text font-bold">Date</span>
        </label>
        <input
          type="date"
          className="input input-bordered w-full max-w-xs"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
        <label className="label">
          <span className="label-text font-bold">Time</span>
        </label>
        <input
          type="time"
          className="input input-bordered w-full max-w-xs"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
        />
      </div>
    </>
  );
};

export default SiteVisitInfo;
