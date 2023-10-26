import React, { useState, useCallback, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../../foundation/components/Sidebar";
import { useSelector } from "react-redux";

const PovertyAlleviation = () => {
  const [povertyName, setPovertyName] = useState("");
  const [povertyAge, setPovertyAge] = useState("");
  const [povertyGender, setPovertyGender] = useState("");
  const [povertyContact, setPovertyContact] = useState("");
  const [povertyComment, setPovertyComment] = useState("");
  const [povertyAmount, setPovertyAmount] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [poverty, setPov] = useState([]);
  const token = useSelector((state) => state.user.token);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const poverty = {
      pov_name: povertyName,
      pov_age: povertyAge,
      pov_gender: povertyGender,
      pov_contact: povertyContact,
      pov_amount: povertyAmount,
      pov_comment: povertyComment,
    };

    try {
      const response = await fetch("http://localhost:8080/api/poverty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(poverty),
      });

      if (!response.ok) {
        toast.error("Error adding Poverty Alleviation Project ", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      // Display success notification
      else {
        toast.success("Poverty Project added successfully!", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      setLoading(false);
      closeModal();

      setPovertyName("");
      setPovertyAge("");
      setPovertyGender("");
      setPovertyContact("");
      setPovertyComment("");
      setPovertyAmount("");
    } catch (error) {
      // Display error notification
      toast.error(error, {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPoverty = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/poverty", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        setPov(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPoverty();
  }, []);

  return (
    <Sidebar>
      <section className="text-center overflow-x-hidden">
        <div className="container mx-auto text-center mt-4">
          <section className="text-gray-600 body-font">
            <div className="sm:flex sm:items-center sm:justify-between mx-8">
              <div>
                <div className="flex items-center gap-x-3">
                  <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                    Poverty Alleviation
                  </h2>
                  <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
                    Welcome 😊
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300 text-start">
                  These are all the Poverty Alleviation Projects that have been
                  Registered under this Pillar.
                </p>
              </div>
              <div className="flex items-center mt-4 gap-x-3">
                <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700">
                  <svg
                    width={20}
                    height={20}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_3098_154395)">
                      <path
                        d="M13.3333 13.3332L9.99997 9.9999M9.99997 9.9999L6.66663 13.3332M9.99997 9.9999V17.4999M16.9916 15.3249C17.8044 14.8818 18.4465 14.1806 18.8165 13.3321C19.1866 12.4835 19.2635 11.5359 19.0351 10.6388C18.8068 9.7417 18.2862 8.94616 17.5555 8.37778C16.8248 7.80939 15.9257 7.50052 15 7.4999H13.95C13.6977 6.52427 13.2276 5.61852 12.5749 4.85073C11.9222 4.08295 11.104 3.47311 10.1817 3.06708C9.25943 2.66104 8.25709 2.46937 7.25006 2.50647C6.24304 2.54358 5.25752 2.80849 4.36761 3.28129C3.47771 3.7541 2.70656 4.42249 2.11215 5.23622C1.51774 6.04996 1.11554 6.98785 0.935783 7.9794C0.756025 8.97095 0.803388 9.99035 1.07431 10.961C1.34523 11.9316 1.83267 12.8281 2.49997 13.5832"
                        stroke="currentColor"
                        strokeWidth="1.67"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_3098_154395">
                        <rect width={20} height={20} fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span>Import Projects</span>
                </button>
                <button
                  className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-primary rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600"
                  onClick={() => setIsModalOpen(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Add a Project</span>
                </button>
                <Modal
                  isOpen={isModalOpen}
                  onRequestClose={closeModal}
                  className="modal-box container mx-auto"
                >
                  {" "}
                  <button
                    onClick={closeModal}
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  >
                    ✕
                  </button>
                  {/* Add your form fields or other content here */}
                  <div>
                    <form onSubmit={handleSubmit}>
                      <label className="label font-bold text-xs">
                        Add a Poverty Alleviation Project
                      </label>
                      <label className="label font-bold text-xs">
                        Name of the one assisted by Poverty Alleviation Project
                      </label>
                      <input
                        className="input input-bordered w-full"
                        name="povertyName"
                        value={povertyName}
                        onChange={(e) => setPovertyName(e.target.value)}
                        spellCheck
                        required
                      />
                      <label className="label font-bold text-xs">
                        Age of the assisted
                      </label>
                      <input
                        className="input input-bordered w-full"
                        name="povertyAge"
                        value={povertyAge}
                        onChange={(e) => setPovertyAge(e.target.value)}
                        spellCheck
                        required
                      />
                      <label className="label font-bold text-xs">
                        Gender of the assisted
                      </label>
                      <select
                        className="input input-bordered w-full"
                        name="povertyGender"
                        value={povertyGender}
                        onChange={(e) => setPovertyGender(e.target.value)}
                        required
                      >
                        <option value="None Selected">
                          Please select Gender
                        </option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                      </select>
                      <label className="label font-bold text-xs">
                        Phone Contact of the assisted
                      </label>
                      <input
                        className="input input-bordered w-full"
                        name="povertyContact"
                        value={povertyContact}
                        onChange={(e) => setPovertyContact(e.target.value)}
                        spellCheck
                        required
                      />
                      <label className="label font-bold text-xs">
                        Comment{" "}
                      </label>
                      <input
                        className="input input-bordered w-full"
                        name="povertyComment"
                        value={povertyComment}
                        onChange={(e) => setPovertyComment(e.target.value)}
                        spellCheck
                        required
                      />
                      <label className="label font-bold text-xs">Amount</label>
                      <input
                        className="input input-bordered w-full"
                        name="povertyAmount"
                        value={povertyAmount}
                        onChange={(e) => setPovertyAmount(e.target.value)}
                        spellCheck
                        required
                      />
                      <button
                        type="submit"
                        className="btn btn-outline my-4 w-full bg-green"
                      >
                        {loading ? "Submitting..." : "Submit"}
                      </button>
                    </form>{" "}
                  </div>
                </Modal>
              </div>
            </div>
            {/*BOXES */}
            <div className="container px-0 py-4 mx-auto">
              <div className="flex flex-wrap m-4 text-center">
                <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                  <div className="border-2 border-gray-200 px-4 py-6 rounded-lg">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      className="text-indigo-500 w-12 h-12 mb-3 inline-block"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 17l4 4 4-4m-4-5v9" />
                      <path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29" />
                    </svg>
                    <h2 className="title-font font-medium text-3xl text-gray-900">
                      2.7K
                    </h2>
                    <p className="leading-relaxed">Total Revenue</p>
                  </div>
                </div>
                <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                  <div className="border-2 border-gray-200 px-4 py-6 rounded-lg">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      className="text-indigo-500 w-12 h-12 mb-3 inline-block"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx={9} cy={7} r={4} />
                      <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" />
                    </svg>
                    <h2 className="title-font font-medium text-3xl text-gray-900">
                      1.3K
                    </h2>
                    <p className="leading-relaxed">Outreached</p>
                  </div>
                </div>
                <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                  <div className="border-2 border-gray-200 px-4 py-6 rounded-lg">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      className="text-indigo-500 w-12 h-12 mb-3 inline-block"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 18v-6a9 9 0 0118 0v6" />
                      <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
                    </svg>
                    <h2 className="title-font font-medium text-3xl text-gray-900">
                      74
                    </h2>
                    <p className="leading-relaxed">Events</p>
                  </div>
                </div>
                <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                  <div className="border-2 border-gray-200 px-4 py-6 rounded-lg">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      className="text-indigo-500 w-12 h-12 mb-3 inline-block"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <h2 className="title-font font-medium text-3xl text-gray-900">
                      46
                    </h2>
                    <p className="leading-relaxed">Total Money used</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th
                              scope="col"
                              className="px-12 py-3.5 text-sm font-normal text-center text-gray-500 dark:text-gray-400"
                            >
                              <div className="text-center">
                                <div className="flex items-center gap-x-3 focus:outline-none">
                                  <span>Name of the one assisted</span>
                                  <svg
                                    className="h-3"
                                    viewBox="0 0 10 11"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="0.1"
                                    />
                                    <path
                                      d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="0.1"
                                    />
                                    <path
                                      d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      strokeWidth="0.3"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </th>
                            <th
                              scope="col"
                              className="px-12 py-3.5 text-sm font-normal text-center text-gray-500 dark:text-gray-400"
                            >
                              Gender
                            </th>
                            <th
                              scope="col"
                              className="px-12 py-3.5 text-sm font-normal text-center text-gray-500 dark:text-gray-400"
                            >
                              Contact
                            </th>{" "}
                            <th
                              scope="col"
                              className="px-12 py-3.5 text-sm font-normal text-center text-gray-500 dark:text-gray-400"
                            >
                              Comment
                            </th>{" "}
                            <th
                              scope="col"
                              className="px-12 py-3.5 text-sm font-normal text-center text-gray-500 dark:text-gray-400"
                            >
                              Amount Disbursed
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                          {poverty.map((poverty, index) => (
                            <tr key={index}>
                              <td className="px-12 py-4 text-sm font-medium whitespace-nowrap text-start">
                                <div className="flex flex-col justify-center items-start">
                                  <div>{poverty.pov_name}</div>
                                  <div className="px-3 mt-2 py-1 text-sm font-normal rounded-full text-blue-500 gap-x-2 bg-blue-200 dark:bg-gray-800">
                                    {poverty.pov_age} years old
                                  </div>
                                </div>
                              </td>
                              <td className="px-12 py-4 text-sm font-medium whitespace-nowrap text-center">
                                {poverty.pov_gender}
                              </td>
                              <td className="px-12 py-4 text-sm font-medium whitespace-nowrap text-center">
                                {poverty.pov_contact}
                              </td>
                              <td className="px-12 py-4 text-sm font-medium whitespace-nowrap text-center">
                                {poverty.pov_comment}
                              </td>
                              <td className="px-12 py-4 text-sm font-medium whitespace-nowrap text-center">
                                {poverty.pov_amount}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </Sidebar>
  );
};

export default PovertyAlleviation;
