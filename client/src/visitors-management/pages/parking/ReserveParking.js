import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import logo from "../../../assets/optiven-logo-full.png";

const ReserveParking = () => {
  const [name, setName] = useState("");
  const [vehicleRegistration, setVehicleRegistration] = useState("");
  const [arrivalTime, setEstimatedArrivalTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = useSelector((state) => state.user.token);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !vehicleRegistration || !arrivalTime) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError(""); // Clear any previous errors
    const parkingData = {
      name,
      vehicle_registration: vehicleRegistration,
      arrival_time: arrivalTime,
    };
    try {
      const response = await fetch(
        "https://workspace.optiven.co.ke/api/reserve-parking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(parkingData),
        }
      );

      if (!response.ok) {
        throw new Error("An error occurred while adding parking information.");
      }

      setLoading(false);
      navigate("/reserved-parking");

      // Display success notification
      toast.success("Parking reserved successfully!", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Generate and download PDF form
      generateDownloadableForm(parkingData);

      // Reset form fields
      setName("");
      setVehicleRegistration("");
      setEstimatedArrivalTime("");
    } catch (error) {
      console.error("Error adding parking information:", error);
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

  const generateDownloadableForm = (parkingData) => {
    const { vehicle_registration } = parkingData;

    // Create a new PDF document
    const doc = new jsPDF();

    // Set the document properties
    doc.setProperties({
      title: "Parking Reservation Form",
    });

    const logoWidth = 100;
    const logoHeight = 50;
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage(logo, "PNG", logoX, 20, logoWidth, logoHeight);

    // Set the font style for the ticket content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Define the content of the form
    const currentDate = new Date().toLocaleDateString(); // Get the current date
    const ticketContent = `
      ${currentDate}
      
      TO:
      PROPERTY MANAGER,
      GIMCO LIMITED,
      BARCLAYS BANK,
      P.O BOX 30120-00100,
      NAIROBI.
      
      Attn: Kinyua
      
      Dear Sir,
      
      RE: PARKING
      
      We trust that you are well. Kindly reserve this parking.
      
      Vehicle Registration: ${vehicle_registration}
      
      Thank you.
      
      Yours faithfully,
      
      Winfred Waithera
      Customer Experience
      Optiven Limited
      `;

    // Add the ticket content below the logo
    doc.text(20, 90, ticketContent);

    // Save the PDF document as a file
    doc.save("parking_reservation_form.pdf");
  };

  return (
    <>
      <Sidebar>
        <section className="bg-white">
          <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
            <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
              <img
                src="https://images.unsplash.com/photo-1617392847656-10a3744239cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80"
                alt="interview-banner"
                className="absolute top-0 left-0 h-full w-full object-cover"
              />
            </section>

            <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-8 xl:col-span-6">
              <div className="max-w-xl lg:max-w-3xl">
                <div className="text-sm breadcrumbs">
                  <ul>
                    <li>
                      <Link to="/visitors-management">Home</Link>
                    </li>
                    <li>Reserve Parking</li>
                  </ul>
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
                    <label htmlFor="vehicle_registration" className="label">
                      <span className="label-text font-bold">
                        Vehicle Registration
                      </span>
                    </label>
                    <input
                      type="text"
                      id="vehicle_registration"
                      placeholder="KDA 123Q"
                      value={vehicleRegistration}
                      onChange={(event) =>
                        setVehicleRegistration(event.target.value)
                      }
                      className="input input-bordered w-full max-w-xs"
                      required
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="arrivalTime" className="label">
                      <span className="label-text font-bold">
                        Estimated Arrival Time
                      </span>
                    </label>
                    <input
                      type="time"
                      id="arrivalTime"
                      value={arrivalTime}
                      onChange={(event) =>
                        setEstimatedArrivalTime(event.target.value)
                      }
                      className="input input-bordered w-full max-w-xs"
                      required
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3 md:mt-5 lg:mt-5">
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    <button
                      type="submit"
                      className="btn btn-primary mt-4 w-full max-w-xs"
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Reserve Parking"}
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

export default ReserveParking;
