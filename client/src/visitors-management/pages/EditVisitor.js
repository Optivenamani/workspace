import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate, useParams } from "react-router-dom";

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date
    .toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "-");
};

const EditVisitor = () => {
  const { id } = useParams();
  const visitorId = id;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [vehicleRegistration, setVehicleRegistration] = useState("");
  const [purpose, setPurpose] = useState("");
  const [department, setDepartment] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  console.log("Visitors ID: " + visitorId)

  useEffect(() => {
    fetchVisitor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchVisitor = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/visitors/${visitorId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setName(data.name);
      setPhone(data.phone);
      setEmail(data.email);
      setVehicleRegistration(data.vehicle_registration);
      setPurpose(data.purpose);
      setDepartment(data.department);
      setCheckInTime(data.check_in_time);
      setCheckInDate(data.check_in_date);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const visitorData = {
      name,
      phone,
      email,
      vehicle_registration: vehicleRegistration,
      purpose,
      department,
      check_in_time: checkInTime,
      check_in_date: formatDate(checkInDate),
    };
    try {
      const response = await fetch(
        `http://localhost:8080/api/visitors/${visitorId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(visitorData),
        }
      );

      console.log("Serialized data:", JSON.stringify(visitorData))

      const data = await response.json();
      console.log(data);
      setLoading(false);
      navigate("/view-visitors");
    } catch (error) {
      alert(error);
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar>
        <div className="hero mt-10">
          <form
            onSubmit={handleSubmit}
            className="form-control w-full max-w-xs"
          >
            <label htmlFor="Name" className="label">
              <span className="label-text font-bold">Name</span>
            </label>
            <input
              type="text"
              id="Name"
              value={name}
              placeholder="John Doe"
              onChange={(event) => setName(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />

            <label htmlFor="Phone" className="label">
              <span className="label-text font-bold">Phone</span>
            </label>
            <input
              type="tel"
              id="Phone"
              placeholder="1234567890"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />

            <label htmlFor="Email" className="label">
              <span className="label-text font-bold">Email</span>
            </label>
            <input
              type="email"
              id="Email"
              placeholder="example@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />

            <label htmlFor="vehicleRegistration" className="label">
              <span className="label-text font-bold">Vehicle Registration</span>
            </label>
            <input
              type="text"
              id="vehicleRegistration"
              placeholder="KDP 666X"
              value={vehicleRegistration}
              onChange={(event) => setVehicleRegistration(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />

            <label htmlFor="Purpose" className="label">
              <span className="label-text font-bold">Purpose</span>
            </label>
            <input
              type="text"
              id="Purpose"
              placeholder="Meeting"
              value={purpose}
              onChange={(event) => setPurpose(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />

            <label htmlFor="Department" className="label">
            <span className="label-text font-bold">Department</span>
          </label>
          <select
            id="Department"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            className="input input-bordered w-full max-w-xs"
          >
            <option value="">Select Department</option>
            <option value="diaspora">Diaspora</option>
            <option value="HR">HR & Admin</option>
            <option value="Registry">Registry & Documentation</option>
            <option value="Legal">Legal Department</option>
            <option value="Accounts">Accounts & Finance</option>
            <option value="Sales">Sales & Marketing</option>
            <option value="Strategy">Strategy & Operations</option>
            <option value="Project Department">Project Department</option>
            <option value="Digital Department">Digital Department</option>
            <option value="ICT">ICT & Systems</option>
            <option value="Customer Service">Customer Service</option>
            <option value="CEO Support">CEO Support</option>
            <option value="Procurement">Procurement</option>
            <option value="Property Management">Property Management</option>
            <option value="Audit">Audit & Compliance</option>
            <option value="Construction">Construction</option>
            <option value="Architecture">Architecture & Design</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Landscaping">Landscaping</option>
            <option value="Health Safety">Health & Safety</option>
            <option value="Quality Assurance">Quality Assurance</option>
            <option value="Client Services">Client Services</option>
          </select>
          

            <label htmlFor="checkInTime" className="label">
              <span className="label-text font-bold">Check-in Time</span>
            </label>
            <input
              type="time"
              id="check_in_time"
              value={checkInTime}
              onChange={(event) => setCheckInTime(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />

            <label htmlFor="checkInDate" className="label">
              <span className="label-text font-bold">Check-In Date</span>
            </label>
            <input
              type="date"
              id="check_in_date"
              value={formatDate(checkInDate)}
              onChange={(event) => setCheckInDate(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />

            <button
              type="submit"
              disabled={loading}
              id="submit"
              className="btn btn-primary w-full max-w-xs mt-4 text-white"
            >
              {loading ? "Saving..." : "Edit Visitor"}
            </button>
          </form>
        </div>
      </Sidebar>
    </>
  );
};

export default EditVisitor;
