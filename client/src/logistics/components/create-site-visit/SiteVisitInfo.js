import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SiteVisitInfo = ({ formData, setFormData }) => {
  const [sites, setSites] = useState([]);
  const [selfDrive, setSelfDrive] = useState(false);
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await fetch(
          "https://workspace.optiven.co.ke/api/sites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setSites(data);
      } catch (error) {
        console.error("Error fetching site visits:", error);
      }
    };

    fetchSites();
  }, [token]);

  const handleSelfDriveChange = (e) => {
    const isChecked = e.target.checked;
    setSelfDrive(isChecked);

    if (isChecked) {
      setFormData({ ...formData, pickup_location: "Self Drive" });
    } else {
      setFormData({ ...formData, pickup_location: "" });
    }
  };

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
          value={selfDrive ? "Self Drive" : formData.pickup_location}
          onChange={(e) =>
            setFormData({ ...formData, pickup_location: e.target.value })
          }
          placeholder="eg. ABSA Towers"
          className="input input-bordered w-full"
          disabled={selfDrive}
        />
        <div className="flex my-2 items-center">
          <input
            type="checkbox"
            className="checkbox"
            onChange={handleSelfDriveChange}
          />
          <p className="text-sm font-bold italic ml-1">
            My client opted for self drive
          </p>
        </div>

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
