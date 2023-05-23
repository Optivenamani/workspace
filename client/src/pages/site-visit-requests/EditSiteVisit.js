import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/Sidebar";

const EditSiteVisit = () => {
  const [sites, setSites] = useState([]);
  const [siteVisit, setSiteVisit] = useState({
    project_id: "",
    pickup_location: "",
    pickup_time: "",
    pickup_date: "",
    clients: [],
    marketer_id: "",
  });
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();

  const { id } = useParams();

  const handleRemoveClient = (index) => {
    const updatedClients = [...siteVisit.clients];
    updatedClients.splice(index, 1);
    setSiteVisit({
      ...siteVisit,
      clients: updatedClients,
    });
  };

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

  // Fetch the site visit data from the server
  useEffect(() => {
    // Make an API request to fetch the site visit data based on the ID
    const fetchSiteVisit = async () => {
      try {
        const response = await fetch(
          `https://workspace.optiven.co.ke/api/site-visit-requests/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const siteVisitData = await response.json();

        const simplifiedSiteVisit = {
          project_id: siteVisitData.project_id,
          pickup_location: siteVisitData.pickup_location,
          pickup_time: siteVisitData.pickup_time,
          pickup_date: formatDate(siteVisitData.pickup_date),
          clients: siteVisitData.clients.map((client) => {
            return {
              name: client.client_name,
              email: client.client_email,
              phone_number: client.client_phone,
            };
          }),
          marketer_id: siteVisitData.marketer_id,
        };

        setSiteVisit(simplifiedSiteVisit); // Update the state with the fetched site visit data
      } catch (error) {
        console.log(error);
      }
    };

    fetchSiteVisit();
  }, [id, token]);

  const handleAddClient = () => {
    const updatedClients = [...siteVisit.clients];
    updatedClients.push({ name: "", email: "", phone_number: "" });

    setSiteVisit({
      ...siteVisit,
      clients: updatedClients,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make an API request to update the site visit data
    const updateSiteVisit = async () => {
      const requestObject = {
        project_id: siteVisit.project_id,
        pickup_location: siteVisit.pickup_location,
        pickup_time: siteVisit.pickup_time,
        pickup_date: formatDate(siteVisit.pickup_date),
        clients: siteVisit.clients.map((client) => {
          return {
            name: client.name,
            email: client.email,
            phone_number: client.phone_number,
          };
        }),
        marketer_id: siteVisit.marketer_id,
      };
      try {
        const response = await fetch(
          `https://workspace.optiven.co.ke/api/site-visits/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestObject),
          }
        );

        if (response.ok) {
          toast.success("Site visit successfully updated.", {
            position: "top-center",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          navigate("/my-site-visits");
        } else {
          toast.error("Error updating the site visit.", {
            position: "top-center",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          console.log(response);
        }
      } catch (error) {
        console.log(error);
      }
    };

    updateSiteVisit();
  };

  const isUpdateButtonDisabled = siteVisit.clients.length === 0;

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

  return (
    <Sidebar>
      <div className="flex flex-col items-center my-10">
        <h2 className="font-bold uppercase text-xl">Edit Site Visit</h2>
        <form onSubmit={handleSubmit} className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text font-bold">Site Name</span>
          </label>
          <select
            className="select select-bordered w-full max-w-xs"
            value={siteVisit.project_id}
            onChange={(e) => {
              setSiteVisit({
                ...siteVisit,
                project_id: e.target.value,
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
            name="pickup_location"
            value={siteVisit.pickup_location}
            onChange={(e) =>
              setSiteVisit({
                ...siteVisit,
                pickup_location: e.target.value,
              })
            }
            className="input input-bordered w-full"
          />
          <label className="label">
            <span className="label-text font-bold">Pickup Time</span>
          </label>
          <input
            type="time"
            name="pickup_time"
            value={siteVisit.pickup_time}
            onChange={(e) =>
              setSiteVisit({
                ...siteVisit,
                pickup_time: e.target.value,
              })
            }
            className="input input-bordered w-full"
          />
          <label className="label">
            <span className="label-text font-bold">Pickup Date</span>
          </label>
          <input
            type="date"
            name="pickup_date"
            value={formatDate(siteVisit.pickup_date)}
            onChange={(e) =>
              setSiteVisit({
                ...siteVisit,
                pickup_date: e.target.value,
              })
            }
            className="input input-bordered w-full"
          />
          <h2 className="flex flex-col items-center mt-4 font-bold uppercase text-xl">
            Clients
          </h2>
          {siteVisit.clients.map((client, index) => (
            <div key={index} className="card bg-base-100 shadow-xl p-4 m-2">
              <label className="label">
                <span className="label-text font-bold">Client Name</span>
              </label>
              <input
                type="text"
                name={`clients[${index}].name`}
                value={client.name}
                onChange={(e) => {
                  const updatedClients = [...siteVisit.clients];
                  updatedClients[index] = {
                    ...updatedClients[index],
                    name: e.target.value,
                  };
                  setSiteVisit({
                    ...siteVisit,
                    clients: updatedClients,
                  });
                }}
                className="input input-bordered w-full"
              />
              <label className="label">
                <span className="label-text font-bold">Client Email</span>
              </label>
              <input
                type="text"
                name={`clients[${index}].email`}
                value={client.email}
                onChange={(e) => {
                  const updatedClients = [...siteVisit.clients];
                  updatedClients[index] = {
                    ...updatedClients[index],
                    email: e.target.value,
                  };
                  setSiteVisit({
                    ...siteVisit,
                    clients: updatedClients,
                  });
                }}
                className="input input-bordered w-full"
              />
              <label className="label">
                <span className="label-text font-bold">
                  Client Phone Number
                </span>
              </label>
              <input
                type="text"
                name={`clients[${index}].phone_number`}
                value={client.phone_number}
                onChange={(e) => {
                  const updatedClients = [...siteVisit.clients];
                  updatedClients[index] = {
                    ...updatedClients[index],
                    phone_number: e.target.value,
                  };
                  setSiteVisit({
                    ...siteVisit,
                    clients: updatedClients,
                  });
                }}
                className="input input-bordered w-full"
              />
              <button
                className="btn mt-3 btn-error text-white"
                onClick={() => handleRemoveClient(index)}
              >
                Remove Client
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn mt-3 btn-primary text-white"
            onClick={handleAddClient}
          >
            Add Client
          </button>
          <button
            type="submit"
            className="btn mt-3 btn-gray-600 text-white"
            disabled={isUpdateButtonDisabled}
          >
            Update Site Visit
          </button>
        </form>
      </div>
    </Sidebar>
  );
};

export default EditSiteVisit;
