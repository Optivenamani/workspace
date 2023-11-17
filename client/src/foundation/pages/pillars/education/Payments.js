import React, { useState, useCallback, useEffect, useMemo } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../../components/Sidebar";
import { useSelector } from "react-redux";

const Payments = () => {
  const [paidAmount, setPaidAmount] = useState("");
  const [payConfirmation, setPayConfirmation] = useState("");
  const [payInstitution, setPayInstitution] = useState("");
  const [payComment, setPayComment] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [isModal4Open, setIsModal4Open] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [pay, setPay] = useState([]);
  const [educ, setEduc] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.user.token);

  const closedModal4 = useCallback(() => {
    setIsModal4Open(false);
  }, []);

  const addPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    const pay = {
      student_id: selectedStudent,
      student_level: selectedLevel,
      pay_amount: paidAmount,
      pay_confirmation: payConfirmation,
      pay_institution: payInstitution,
      pay_comment: payComment,
    };
    try {
      const response = await fetch(
        "http://localhost:8080/api/education/payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(pay),
        }
      );
      if (!response.ok) {
        toast.error("Error adding Payment", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      // Display success notification
      else {
        toast.success("Payment added successfully!", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      setLoading(false);

      setSelectedStudent("");
      setSelectedLevel("");
      setPaidAmount("");
      setPayConfirmation("");
      setPayInstitution("");
      closedModal4();
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
    const fetchPayments = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/education/payments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        setPay(data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchEducation = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/education", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        const sortedData = data.sort((a, b) => {
          return b.id - a.id;
        });

        console.log("education data", sortedData);

        setEduc(sortedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPayments();
    fetchEducation();
  }, [token]);

  const filteredStudentPaymentDetails = useMemo(() => {
    return pay.filter((item) => {
      const level = item.pay_institution && item.pay_institution.toLowerCase();
      const query = searchedQuery.toLowerCase();

      if (searchedQuery === "") {
        return true; // Include all items when the search query is empty
      } else if (level && level.includes(query)) {
        return true; // Include the item if it matches the search query
      } else {
        return false; // Exclude the item if it doesn't match the search query
      }
    });
  }, [searchedQuery, pay]);
  const filteredEducated = useMemo(() => {
    return educ.filter((item) => {
      if (searchQuery === "") {
        return true; // Include all items when the search query is empty
      } else if (
        item.educ_name &&
        item.educ_name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return true; // Include the item if it matches the search query
      } else {
        return false; // Exclude the item if it doesn't match the search query
      }
    });
  }, [searchQuery, educ]);

  return (
    <Sidebar>
      <section className="text-center overflow-x-hidden">
        <div className="container mx-auto text-center mt-4">
          <section className="text-gray-600 body-font">
            <div className="container px-0 py-2 mx-auto">
              {/*SECOND TABLE*/}
              <div className="sm:flex sm:items-center sm:justify-between mx-8 pt-2">
                <div>
                  <div className="flex items-center gap-x-3">
                    <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                      Payments made
                    </h2>
                    <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
                      Welcome 😊
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-300 text-start">
                    These are all the Payments made for the Students under this
                    Pillar.
                    <br></br>
                  </p>
                </div>
                {/*ACTION BUTTONS CODE*/}
                <div className="flex items-center mt-4 gap-x-3">
                  <button
                    className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-primary rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600"
                    onClick={() => setIsModal4Open(true)}
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
                    <span>Register Payment</span>
                  </button>
                  <Modal
                    isOpen={isModal4Open}
                    onRequestClose={closedModal4}
                    className="modal-box container mx-auto"
                  >
                    {" "}
                    <button
                      onClick={closedModal4}
                      className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    >
                      ✕
                    </button>
                    {/* Add your form fields or other content here */}
                    <div>
                      <form onSubmit={addPayment}>
                        <label className="label font-bold text-xs">
                          Make a Payment
                        </label>
                        <label className="label font-bold text-xs">
                          Select the Student
                        </label>
                        <select
                          className="input input-bordered w-full"
                          name="selectedStudent"
                          value={selectedStudent}
                          onChange={(e) => setSelectedStudent(e.target.value)}
                          required
                        >
                          <option value="">Please select a student</option>
                          {filteredEducated.map((educ) => (
                            <option key={educ.educ_id} value={educ.educ_id}>
                              {educ.educ_name}
                            </option>
                          ))}
                        </select>

                        <label className="label font-bold text-xs">
                          Select Level of the Student
                        </label>
                        <select
                          className="input input-bordered w-full"
                          name="selectedLevel"
                          value={selectedLevel}
                          onChange={(e) => setSelectedLevel(e.target.value)}
                          required
                        >
                          <option value="None Selected">
                            Please select Educational Level of the Student
                          </option>
                          <option value="PP1">PP1</option>
                          <option value="PP2">PP2</option>
                          <option value="Lower Primary Grade 1">
                            Lower Primary Grade 1
                          </option>
                          <option value="Lower Primary Grade 2">
                            Lower Primary Grade 2
                          </option>
                          <option value="Lower Primary Grade 3">
                            Lower Primary Grade 3
                          </option>
                          <option value="Lower Primary Grade 4">
                            Lower Primary Grade 4
                          </option>
                          <option value="Lower Primary Grade 5">
                            Lower Primary Grade 5
                          </option>
                          <option value="Lower Primary Grade 6">
                            Lower Primary Grade 6
                          </option>
                          <option value="Junior Secondary Grade 7">
                            Junior Secondary Grade 7
                          </option>
                          <option value="Junior Secondary Grade 8">
                            Junior Secondary Grade 8
                          </option>
                          <option value="Junior Secondary Grade 9">
                            Junior Secondary Grade 9
                          </option>
                          <option value="Senior Secondary Grade 10">
                            Senior Secondary Grade 10
                          </option>
                          <option value="Senior Secondary Grade 11">
                            Senior Secondary Grade 11
                          </option>
                          <option value="Senior Secondary Grade 12">
                            Senior Secondary Grade 12
                          </option>
                          <option value="Form 1">Form 1</option>{" "}
                          <option value="Form 2">Form 2</option>
                          <option value="Form 3">Form 3</option>
                          <option value="Form 4">Form 4</option>
                          <option value="University">University</option>
                        </select>
                        <label className="label font-bold text-xs">
                          Institution of the Student{" "}
                        </label>
                        <input
                          className="input input-bordered w-full"
                          name="payInstitution"
                          value={payInstitution}
                          onChange={(e) => setPayInstitution(e.target.value)}
                          type="text"
                          spellCheck
                          required
                        />
                        <label className="label font-bold text-xs">
                          Amount Disbursed{" "}
                        </label>
                        <input
                          className="input input-bordered w-full"
                          name="paidAmount"
                          value={paidAmount}
                          onChange={(e) => setPaidAmount(e.target.value)}
                          type="number"
                          spellCheck
                          required
                        />
                        <label className="label font-bold text-xs">
                          Confirmation of pay{" "}
                        </label>
                        <input
                          className="input input-bordered w-full"
                          name="payConfirmation"
                          value={payConfirmation}
                          onChange={(e) => setPayConfirmation(e.target.value)}
                          spellCheck
                          required
                          type="textarea"
                        />
                        <label className="label font-bold text-xs">
                          Comment on the Transaction{" "}
                        </label>
                        <input
                          className="input input-bordered w-full"
                          name="payComment"
                          value={payComment}
                          onChange={(e) => setPayComment(e.target.value)}
                          type="text"
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
              {/*Search Button*/}
              <div className="mt-6 md:flex md:items-center md:justify-between">
                <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700"></div>
                <div className="relative flex items-center mt-4 md:mt-0">
                  <span className="absolute">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Search Payment by Student name..."
                    value={searchedQuery}
                    onChange={(e) => setSearchedQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                      <table className="table w-full table-zebra">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th></th>
                            <th
                              scope="col"
                              className="px-12 py-3.5 text-sm font-normal text-center text-gray-500 dark:text-gray-400"
                            >
                              Institution{" "}
                            </th>
                            <th
                              scope="col"
                              className="px-12 py-3.5 text-sm font-normal text-center text-gray-500 dark:text-gray-400"
                            >
                              Level of the Student
                            </th>
                            <th
                              scope="col"
                              className="px-12 py-3.5 text-sm font-normal text-center text-gray-500 dark:text-gray-400"
                            >
                              Amount of money Disbursed
                            </th>
                            <th
                              scope="col"
                              className="px-12 py-3.5 text-sm font-normal text-center text-gray-500 dark:text-gray-400"
                            >
                              Confirmation of Payment{" "}
                            </th>
                            <th
                              scope="col"
                              className="px-12 py-3.5 text-sm font-normal text-center text-gray-500 dark:text-gray-400"
                            >
                              Comment on the Transaction{" "}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                          {filteredStudentPaymentDetails.map((pay, index) => (
                            <tr key={index}>
                              <th>{index + 1}</th>

                              <td className="py-4 text-sm font-medium whitespace-nowrap text-center">
                                {" "}
                                {pay.pay_institution}
                              </td>
                              <td className="px-12 py-4 text-sm font-medium whitespace-nowrap text-center">
                                {pay.student_level}
                              </td>
                              <td className="py-4 text-sm font-medium whitespace-nowrap text-center">
                                {" "}
                                {pay.pay_amount}
                              </td>
                              <td className="px-12 py-4 text-sm font-medium whitespace-nowrap text-center">
                                {pay.pay_confirmation}
                              </td>
                              <td className="py-4 text-sm font-medium whitespace-nowrap text-center">
                                {" "}
                                {pay.pay_comment}
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
            ;
          </section>
        </div>
      </section>
    </Sidebar>
  );
};
export default Payments;
