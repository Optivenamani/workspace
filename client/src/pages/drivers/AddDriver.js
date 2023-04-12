import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

const AddDriver = () => {
  const [driverName, setDriverName] = useState("");
  const [driverEmail, setDriverEmail] = useState("");
  const [driverPhoneNumber, setDriverPhoneNumber] = useState("");
  const [driverAddress, setDriverAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const driver = {
      driver_name: driverName,
      driver_email: driverEmail,
      driver_phone_number: driverPhoneNumber,
      driver_address: driverAddress,
    };

    try {
      const response = await fetch("http://localhost:8080/api/drivers/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(driver),
      });

      const data = await response.json();
      console.log(data);
      setLoading(false);
      navigate("/view-drivers");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar>
        <div className="hero mt-20">
          <form
            onSubmit={handleSubmit}
            className="form-control w-full max-w-xs"
          >
            <label htmlFor="driverName" className="label">
              <span className="label-text font-bold">Driver Name</span>
            </label>
            <input
              type="text"
              id="driverName"
              value={driverName}
              placeholder="John Smith"
              onChange={(event) => setDriverName(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="driverEmail" className="label">
              <span className="label-text font-bold">Driver Email</span>
            </label>
            <input
              type="email"
              id="driverEmail"
              placeholder="john@mail.com"
              value={driverEmail}
              onChange={(event) => setDriverEmail(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="driverPhoneNumber" className="label">
              <span className="label-text font-bold">Phone Number</span>
            </label>
            <input
              type="tel"
              id="driverPhoneNumber"
              placeholder="0712345678"
              value={driverPhoneNumber}
              onChange={(event) => setDriverPhoneNumber(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="driverAddress" className="label">
              <span className="label-text font-bold">Driver Address</span>
            </label>
            <input
              type="text"
              id="driverAddress"
              placeholder="BP. 69420, Nice."
              value={driverAddress}
              onChange={(event) => setDriverAddress(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <button
              type="submit"
              disabled={loading}
              id="submit"
              className="btn btn-primary w-full max-w-xs mt-4 text-white"
            >
              {loading ? "Saving..." : "Add Driver"}
            </button>
          </form>
        </div>
      </Sidebar>
    </>
  );
};

export default AddDriver;
