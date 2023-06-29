import React, { useState } from "react";
import Sidebar from "../../logistics/components/Sidebar";
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
                src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />

              <div className="hidden lg:relative lg:block lg:p-12">
                <div className="block text-white text-4xl">
                🛎️
                </div>

                <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl uppercase">
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
                    <span className="sr-only">Home</span>
                    <svg
                      className="h-8 sm:h-10"
                      viewBox="0 0 28 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>

                  <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                    Welcome to Squid 🦑
                  </h1>

                  <p className="mt-4 leading-relaxed text-gray-500">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Eligendi nam dolorum aliquam, quibusdam aperiam voluptatum.
                  </p>
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
                      type="text"
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
                      <option value="Procurement">Procurement</option>
                      <option value="Property Management">
                        Property Management
                      </option>
                      <option value="Audit">Audit & Compliance</option>
                      <option value="Construction">Construction</option>
                      <option value="Architecture">
                        Architecture & Design
                      </option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Landscaping">Landscaping</option>
                      <option value="Health Safety">Health & Safety</option>
                      <option value="Quality Assurance">
                        Quality Assurance
                      </option>
                      <option value="Client Services">Client Services</option>
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
