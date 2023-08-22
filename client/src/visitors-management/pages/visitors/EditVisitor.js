import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [visitorRoom, setVisitorRoom] = useState("");
  const [staff, setStaff] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [loading, setLoading] = useState(false);
  const [allStaff, setAllStaff] = useState([]);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.user.token);

  const navigate = useNavigate();

  const handleStaffChange = (event) => {
    const selectedStaff = allStaff.find(
      (staffMember) => staffMember.fullnames === event.target.value
    );
    if (selectedStaff) {
      setStaff(selectedStaff.fullnames);
      setSelectedStaffId(selectedStaff.user_id);
      setError("");
    } else {
      setStaff(event.target.value);
      setSelectedStaffId("");
      setError("Invalid staff member selected.");
    }
  };

  const fetchVisitor = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://workspace.optiven.co.ke/api/visitors/${visitorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
      setVisitorRoom(data.visitor_room);
      setSelectedStaffId(data.staff_id);
      setStaff(data.staff_name);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(
          "https://workspace.optiven.co.ke/api/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("Staff:", data);
        setAllStaff(data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchStaff();
  }, [token]);

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
      visitor_room: visitorRoom,
      staff_id: selectedStaffId,
    };

    try {
      const response = await fetch(
        `https://workspace.optiven.co.ke/api/visitors/${visitorId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(visitorData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("Visitor updated successfully.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate("/view-visitors");
      } else {
        toast.error("Failed to update visitor.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error("Error updating visitor:", data.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the visitor.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error updating visitor:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar>
        <section className="bg-white">
          <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
            <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
              <img
                alt="Pattern"
                src="https://images.unsplash.com/photo-1638184984605-af1f05249a56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </aside>

            <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
              <div className="max-w-xl lg:max-w-3xl">
                <div className="text-sm breadcrumbs">
                  <ul>
                    <li>
                      <Link to="/visitors-management">Home</Link>
                    </li>
                    <li>
                      <Link to="/view-visitors">View Visitors</Link>
                    </li>
                    <li>Edit Visitor</li>
                  </ul>
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="mt-8 grid grid-cols-6 gap-3"
                >
                  {" "}
                  <div className="col-span-6 sm:col-span-3">
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
                      required
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
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
                  </div>
                  <div className="col-span-6 sm:col-span-3">
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
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
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
                      required
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="Department" className="label">
                      <span className="label-text font-bold">Department</span>
                    </label>
                    <select
                      id="Department"
                      value={department}
                      onChange={(event) => setDepartment(event.target.value)}
                      className="select select-bordered w-full max-w-xs"
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
                      <option value="Compliance">Compliance</option>
                      <option value="PR Media">PR Media </option>
                      <option value="PR Communication">PR Communication</option>
                    </select>
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="checkInTime" className="label">
                      <span className="label-text font-bold">
                        Check-in Time
                      </span>
                    </label>
                    <input
                      type="time"
                      id="check_in_time"
                      value={checkInTime}
                      onChange={(event) => setCheckInTime(event.target.value)}
                      className="input input-bordered w-full max-w-xs"
                      required
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
                      id="check_in_date"
                      value={formatDate(checkInDate)}
                      onChange={(event) => setCheckInDate(event.target.value)}
                      className="input input-bordered w-full max-w-xs"
                      required
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="visitorRoom" className="label">
                      <span className="label-text font-bold">Visitor Room</span>
                    </label>
                    <input
                      type="text"
                      id="visitorRoom"
                      placeholder="Room 404"
                      value={visitorRoom}
                      onChange={(event) => setVisitorRoom(event.target.value)}
                      className="input input-bordered w-full max-w-xs"
                      required
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="staff" className="label">
                      <span className="label-text font-bold">Staff Name</span>
                    </label>
                    <input
                      type="text"
                      id="staff"
                      placeholder="Jane Doe"
                      value={staff}
                      onChange={handleStaffChange}
                      className="input input-bordered w-full max-w-xs"
                      required
                      list="staff-suggestions"
                    />
                    <datalist id="staff-suggestions">
                      {allStaff.map((staffMember) => (
                        <option
                          key={staffMember.user_id}
                          value={staffMember.fullnames}
                        />
                      ))}
                    </datalist>
                    <span className="mt-1 font-bold text-xs text-red-600">
                      {error}
                    </span>
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    <button
                      type="submit"
                      disabled={loading || !selectedStaffId}
                      id="submit"
                      className="btn btn-primary w-full max-w-xs text-white"
                    >
                      {loading ? "Saving..." : "Edit Visitor"}
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

export default EditVisitor;