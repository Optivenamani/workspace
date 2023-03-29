import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";

const CreateSite = () => {
  const [siteName, setSiteName] = useState("");
  const [siteLocation, setSiteLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const site = {
      siteName,
      siteLocation,
    };
    console.log(site);
    setLoading(false);
    // todo: submit to db
  };

  return (
    <>
      <Sidebar>
        <div className="hero mt-20">
          <form
            onSubmit={handleSubmit}
            className="form-control w-full max-w-xs"
          >
            <label htmlFor="siteName" className="label">
              <span className="label-text font-bold">Site Name</span>
            </label>
            <input
              type="text"
              id="siteName"
              value={siteName}
              placeholder="Valley Springs"
              onChange={(event) => setSiteName(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="siteLocation" className="label">
              <span className="label-text font-bold">Site Location</span>
            </label>
            <input
              type="text"
              id="siteLocation"
              placeholder="Kajiado"
              value={siteLocation}
              onChange={(event) => setSiteLocation(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <button
              type="submit"
              disabled={loading}
              id="submit"
              className="btn btn-primary w-full max-w-xs mt-4 text-white"
            >
              {loading ? "Saving..." : "Add Site"}
            </button>
          </form>
        </div>
      </Sidebar>
    </>
  );
};

export default CreateSite;
