import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SiteVisitInfo = ({ formData, setFormData }) => {
  const [sites, setSites] = useState([]);
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await fetch("http://209.38.246.14:8080/api/sites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setSites(data);
      } catch (error) {
        console.error("Error fetching site visits:", error);
      }
    };

    fetchSites();
  }, [token]);

  return (
    <>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text font-bold">Site</span>
        </label>
        <select
          className="select select-bordered w-full max-w-xs"
          value={formData.project_id}
          onChange={(e) => {
            console.log("Selected value:", e.target.value);

            const selectedSite = sites.find(
              // eslint-disable-next-line eqeqeq
              (site) => site.project_id == e.target.value
            );

            console.log("Selected site:", selectedSite);

            setFormData({
              ...formData,
              project_id: e.target.value,
              site_name: selectedSite ? selectedSite.name : "",
            });
          }}
        >
          <option value="">Select a site</option>
          {sites.map((site) => (
            <option key={site.project_id} value={site.project_id}>
              {site.name}
            </option>
          ))}
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
          <span className="label-text font-bold">Pickup Date</span>
        </label>
        <input
          type="date"
          className="input input-bordered w-full max-w-xs"
          value={formData.pickup_date}
          onChange={(e) =>
            setFormData({ ...formData, pickup_date: e.target.value })
          }
        />
        <label className="label">
          <span className="label-text font-bold">Pickup Time</span>
        </label>
        <input
          type="time"
          className="input input-bordered w-full max-w-xs"
          value={formData.pickup_time}
          onChange={(e) =>
            setFormData({ ...formData, pickup_time: e.target.value })
          }
        />
      </div>
    </>
  );
};

export default SiteVisitInfo;
