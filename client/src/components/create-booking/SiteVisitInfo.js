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
          value={formData.site_name}
          onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
        >
          <option>Site</option>
          <option>Ngong'</option>
          <option>Kitengela</option>
        </select>
        <label className="label">
          <span className="label-text font-bold">Pickup Location</span>
        </label>
        <input
          type="text"
          name="pickupLocation"
          value={formData.pickup_location}
          onChange={(e) =>
            setFormData({ ...formData, pickup_location: e.target.value })
          }
          placeholder="ABSA Towers"
          className="input input-bordered w-full"
        />
        <label className="label">
          <span className="label-text font-bold">Date</span>
        </label>
        <input
          type="date"
          className="input input-bordered w-full max-w-xs"
          value={formData.pickup_date}
          onChange={(e) => setFormData({ ...formData, pickup_date: e.target.value })}
        />
        <label className="label">
          <span className="label-text font-bold">Time</span>
        </label>
        <input
          type="time"
          className="input input-bordered w-full max-w-xs"
          value={formData.pickup_time}
          onChange={(e) => setFormData({ ...formData, pickup_time: e.target.value })}
        />
      </div>
    </>
  );
};

export default SiteVisitInfo;
