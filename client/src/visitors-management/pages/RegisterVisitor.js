import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

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
      console.log(data);
      setLoading(false);
      navigate("/view-visitors");

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
        <section className="bg-white">
          <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
            <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
              <img
                alt="Night"
                src="https://images.unsplash.com/photo-1638184984605-af1f05249a56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80"
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />

              <div className="hidden lg:relative lg:block lg:p-12">
                <div className="block text-white text-4xl">🛎️</div>

                <h2 className="mt-6 text-2xl font-extrabold text-white sm:text-3xl md:text-4xl uppercase">
                  Optiven Visitors Management Platform
                </h2>
              </div>
            </section>

            <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-8 xl:col-span-6">
              <div className="max-w-xl lg:max-w-3xl">
                <div className="relative -mt-16 block lg:hidden">
                  <a
                    className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-blue-600 sm:h-20 sm:w-20"
                    href="/"
                  >
                    <div className="block text-white text-4xl">🛎️</div>
                  </a>
                  <h2 className="mt-6 text-2xl font-extrabold sm:text-3xl md:text-4xl uppercase">
                    Optiven Visitors Management Platform
                  </h2>
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="mt-8 grid grid-cols-6 gap-6"
                >
                  <div className="col-span-6 sm:col-span-3">
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
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="phone" className="label">
                      <span className="label-text font-bold">Phone</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="07XXXXXXXX"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="input input-bordered w-full max-w-xs"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
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
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="vehicleRegistration" className="label">
                      <span className="label-text font-bold">
                        Vehicle Registration
                      </span>
                    </label>
                    <input
                      type="text"
                      id="vehicleRegistration"
                      placeholder="KDP 123X"
                      value={vehicleRegistration}
                      onChange={(event) =>
                        setVehicleRegistration(event.target.value)
                      }
                      className="input input-bordered w-full max-w-xs"
                      autoComplete="off"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="checkInDate" className="label">
                      <span className="label-text font-bold">
                        Check-In Date
                      </span>
                    </label>
                    <input
                      type="date"
                      id="checkInDate"
                      value={checkInDate}
                      onChange={(event) => setCheckInDate(event.target.value)}
                      className="input input-bordered w-full max-w-xs"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="checkInTime" className="label">
                      <span className="label-text font-bold">
                        Check-In Time
                      </span>
                    </label>
                    <input
                      type="time"
                      id="checkInTime"
                      value={checkInTime}
                      onChange={(event) => setCheckInTime(event.target.value)}
                      className="input input-bordered w-full max-w-xs"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
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
                    <option value="Project Department">
                      Project Department
                    </option>
                    <option value="Digital Department">
                      Digital Department
                    </option>
                    <option value="ICT">ICT & Systems</option>
                    <option value="Customer Service">Customer Service</option>
                    <option value="CEO Support">CEO Support</option>
                    <option value="Internal Audit">Internal Audit</option>
                    <option value="Compliance">
                      Compliance
                    </option>
                    <option value="PR Media">PR Media </option>
                    <option value="PR Comunication">PR Comunication</option>
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
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
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    <button
                      type="submit"
                      className="btn btn-primary mt-4 w-full max-w-xs"
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Register Visitor"}
                    </button>
                  </div>
                </form>
              </div>
            </main>
          </div>
        </section>
      </Sidebar>
    </>
  );
};

export default RegisterVisitor;
