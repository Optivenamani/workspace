import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Profile = () => {
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.user.user_id);

  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [modalOpened, setModalOpened] = useState(false);
  const [user, setUser] = useState([]);

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://workspace.optiven.co.ke/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      // Parse and format the 'date' field
      const formattedUser = {
        ...data,
        date: new Date(data.date).toISOString().slice(0, 19).replace("T", " "), // Format as 'YYYY-MM-DD HH:MM:SS'
        reset_date: new Date(data.reset_date)
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
      };

      setUser(formattedUser);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePhone = async (e) => {
    e.preventDefault();
    setLoading(true);

    const trimmedNum = (num) => {
      return num.replace(/^\+/, "");
    };

    const updatedUserData = {
      ...user,
      phone_number: trimmedNum(phoneNumber),
    };

    try {
      const response = await fetch(
        `https://workspace.optiven.co.ke/api/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedUserData),
        }
      );

      const data = await response.json();
      console.log(data);

      // Update the user state with the updated data
      setUser(updatedUserData);

      setLoading(false);
      handleCloseModal();
    } catch (error) {
      console.error("Fetch error:", error);
      setLoading(false);
    }
  };

  const handleView = () => {
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-10 mx-auto flex flex-col">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
          <div className="h-full rounded-lg bg-gray-100 pb-10">
            <div className="flex justify-center items-center mt-6">
              <div className="w-15 h-15 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400 border-gray-500 p-2 border-4">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  className="w-10 h-10"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx={12} cy={7} r={4} />
                </svg>
              </div>
              <div>
                <h2 className="text-md font-bold ml-2">{user.fullnames}</h2>
                <h2 className="text-xs italic ml-2">{user.email}</h2>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center mt-6">
              <div className="flex justify-between">
                <div className="flex items-center justify-between">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    fill="currentColor"
                    className="bi bi-phone mr-2"
                    viewBox="0 0 16 16"
                  >
                    {" "}
                    <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z" />{" "}
                    <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />{" "}
                  </svg>
                  <div className="font-bold text-sm italic mr-2">
                    {user.phone_number
                      ? "+" + user.phone_number
                      : "Missing phone number"}
                  </div>
                  <button
                    className="btn btn-xs text-white"
                    onClick={() => handleView()}
                  >
                    Edit
                  </button>
                </div>
              </div>
              {user.team && (
                <div className="flex justify-start ">
                  <div className="flex items-center justify-between">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      fill="currentColor"
                      className="bi bi-phone mr-2"
                      viewBox="0 0 16 16"
                    >
                      {" "}
                      <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z" />{" "}
                      <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />{" "}
                    </svg>
                    <div className="font-bold text-sm italic mr-2">
                      {user.team}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="h-full rounded-lg bg-gray-100 py-10 flex flex-col items-center lg:h-1/2">
            <div className="flex flex-col justify-center">
              <Link to="/" className="hover:underline">
                Menu
              </Link>
              <Link to="/feedback" className="hover:underline">
                Feedback
              </Link>
              <Link to="/login" className="hover:underline">
                Logout
              </Link>
            </div>
          </div>
          <div className="h-full rounded-lg bg-gray-100 lg:col-span-2">
            <div className="flex justify-center items-center my-6 mx-6 lg:justify-start">
              <div className="w-40 h-40 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400 border-gray-500 p-2 border-4">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  className="w-20 h-20"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx={12} cy={7} r={4} />
                </svg>
              </div>
            </div>
            <div className="flex justify-center items-center m-6 lg:justify-start">
              <div className="flex flex-col items-center justify-center">
                <div
                  className="radial-progress text-primary border-4 mx-2"
                  style={{ "--value": 95 }}
                >
                  95%
                </div>
                <p className="w-1/2 text-sm text-center">
                  95th percentile of something
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div
                  className="radial-progress text-warning border-4 mx-2"
                  style={{ "--value": 75 }}
                >
                  75%
                </div>
                <p className="w-1/2 text-sm text-center">
                  75th percentile of something
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div
                  className="radial-progress text-error border-4 mx-2"
                  style={{ "--value": 25 }}
                >
                  25%
                </div>
                <p className="w-1/2 text-sm text-center">
                  25th percentile of something
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for editing phone number */}
      {modalOpened && (
        <div className="fixed inset-0 flex justify-center items-center z-10 bg-black bg-opacity-50">
          <div className="modal-box container mx-auto">
            <button
              onClick={handleCloseModal}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>

            <div className="flex flex-col">
              <label className="label font-bold">
                Enter Phone Number with Country Code
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="input input-bordered"
                placeholder="+254712345678"
                required
                min={11}
                max={13}
              />
              <button
                onClick={handleChangePhone}
                className="btn btn-outline mt-2"
                disabled={!phoneNumber || phoneNumber.length <= 11}
              >
                {loading ? "Editing..." : "Edit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Profile;
