import React, { useState } from "react";
import Sidebar from "../../logistics/components/Sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import formatTime from "../../utils/formatTime";

const RegisterVisitor = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [vehicleRegistration, setVehicleRegistration] = useState("");
  const [purpose, setPurpose] = useState("");
  const [department, setDepartment] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = useSelector((state) => state.user.token);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !name ||
      !phone ||
      !email ||
      !purpose ||
      !department ||
      !checkInTime ||
      !checkInDate
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!isValidPhone(phone)) {
      setError("Please enter a valid phone number.");
      return;
    }
    setLoading(true);
    setError(""); // Clear any previous errors
    const visitorData = {
      name,
      phone,
      email,
      vehicle_registration: vehicleRegistration,
      purpose,
      department,
      check_in_time: checkInTime,
      check_in_date: checkInDate,
    };
    try {
      const response = await fetch("http://localhost:8080/api/visitors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(visitorData),
      });

      const data = await response.json();
      console.log(visitorData);
      setLoading(false);
      // navigate("/visitors");

      // Display success notification
      toast.success("Visitor registered successfully!", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Reset form fields
      setName("");
      setPhone("");
      setEmail("");
      setVehicleRegistration("");
      setPurpose("");
      setDepartment("");
      setCheckInTime("");
      setCheckInDate("");
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError("An error occurred. Please try again."); // Update error message

      // Display error notification
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const isValidEmail = (email) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    // Basic phone number validation (digits and dashes)
    const phoneRegex = /^\d+(-\d+)*$/;
    return phoneRegex.test(phone);
  };

  return (
    <>
      <Sidebar>
        <div className="hero mt-10">
          <form onSubmit={handleSubmit} className="form-control w-full max-w-xs">
            <label htmlFor="name" className="label">
              <span className="label-text font-bold">Name</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              placeholder="John Smith"
              onChange={(event) => setName(event.target.value)}
              className="input input-bordered w-full max-w-xs"
              required
            />
            <label htmlFor="phone" className="label">
              <span className="label-text font-bold">Phone</span>
            </label>
            <input
              type="text"
              id="phone"
              placeholder="0712-345-678"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="input input-bordered w-full max-w-xs"
              required
            />
            <label htmlFor="email" className="label">
              <span className="label-text font-bold">Email</span>
            </label>
            <input
              type="email"
              id="email"
              placeholder="example@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="input input-bordered w-full max-w-xs"
              required
            />
            <label htmlFor="vehicleRegistration" className="label">
              <span className="label-text font-bold">Vehicle Registration</span>
            </label>
            <input
              type="text"
              id="vehicleRegistration"
              placeholder="KDP 123X"
              value={vehicleRegistration}
              onChange={(event) => setVehicleRegistration(event.target.value)}
              className="input input-bordered w-full max-w-xs"
              autoComplete="off"
            />
            <label htmlFor="purpose" className="label">
              <span className="label-text font-bold">Purpose</span>
            </label>
            <input
              type="text"
              id="purpose"
              placeholder="Meeting"
              value={purpose}
              onChange={(event) => setPurpose(event.target.value)}
              className="input input-bordered w-full max-w-xs"
              required
            />
            <label htmlFor="department" className="label">
              <span className="label-text font-bold">Department</span>
            </label>
            <select
              id="department"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              className="input input-bordered w-full max-w-xs"
              required
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
              <span className="label-text font-bold">Check-In Time</span>
            </label>
            <input
              type="time"
              id="checkInTime"
              value={checkInTime}
              onChange={(event) => setCheckInTime(event.target.value)}
              className="input input-bordered w-full max-w-xs"
              required
            />
            <label htmlFor="checkInDate" className="label">
              <span className="label-text font-bold">Check-In Date</span>
            </label>
            <input
            type="date"
            id="checkInDate"
            value={checkInDate}
            onChange={(event) => setCheckInDate(event.target.value)}
            className="input input-bordered w-full max-w-xs"
            required
          />          
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <button
              type="submit"
              className="btn btn-primary mt-4 w-full max-w-xs"
              disabled={loading}
            >
              {loading ? "Loading..." : "Register Visitor"}
            </button>
          </form>
        </div>
      </Sidebar>
    </>
  );
};

export default RegisterVisitor;
