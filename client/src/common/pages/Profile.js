import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.user.user_id);

  console.log("user id:", userId);

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

    const updatedUserData = {
      ...user,
      phone_number: phoneNumber,
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
      <div className="container px-5 py-24 mx-auto flex flex-col">
        <div className="flex flex-col">
          <div className="text-center">
            <div className="flex flex-col items-center text-center justify-center">
              <div className="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400">
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
              <h2 className="font-medium title-font mt-4 text-gray-900 text-lg">
                {user.fullnames}
              </h2>
              <div className="w-12 h-1 bg-green-500 rounded mt-2 mb-4" />
              <ul>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    fill="currentColor"
                    className="bi bi-envelope mr-2"
                    viewBox="0 0 16 16"
                  >
                    {" "}
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />{" "}
                  </svg>
                  <div className="font-bold text-sm italic">{user.email}</div>
                </li>
                <div className="flex justify-between">
                  <li className="flex items-center justify-between">
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
                      {user.phone_number}
                    </div>
                    <button
                      className="btn btn-secondary btn-xs text-white"
                      onClick={() => handleView()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={16}
                        height={16}
                        fill="currentColor"
                        className="bi bi-pencil-square mr-2"
                        viewBox="0 0 16 16"
                      >
                        {" "}
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />{" "}
                        <path
                          fillRule="evenodd"
                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                        />{" "}
                      </svg>
                      Edit
                    </button>
                  </li>
                </div>
              </ul>
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
              <label className="label font-bold">Edit Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="input input-bordered"
                placeholder="254712345678"
                required
              />
              {/* <span className="font-bold italic text-red-600 text-sm">
                error
              </span> */}
              <button
                onClick={handleChangePhone}
                className="btn btn-outline mt-2"
                disabled={!phoneNumber || phoneNumber.length !== 12}
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
