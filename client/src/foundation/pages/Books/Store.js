import React, { useState, useCallback, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";

const Store = () => {
  const [bookName, setBookName] = useState("");
  const [bookCode, setBookCode] = useState("");
  const [bookPrice, setBookPrice] = useState("");
  const [bookCopies, setBookCopies] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState([]);
  const token = useSelector((state) => state.user.token);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const store = {
      book_name: bookName,
      book_code: bookCode,
      book_price: bookPrice,
      book_copies: bookCopies,
    };

    try {
      const response = await fetch("http://localhost:8080/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(store),
      });

      if (!response.ok) {
        toast.error("Error adding Book", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      // Display success notification
      else {
        toast.success("Book added successfully!", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      setLoading(false);
      closeModal();

      setBookName("");
      setBookCode("");
      setBookPrice("");
      setBookCopies("");
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
    const fetchStore = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/books", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        setStore(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStore();
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
                    Book Store
                  </h2>
                  <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
                    Welcome 😊
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300 text-start">
                  These are all the Books that have been Registered.
                </p>
              </div>
              <div className="flex items-center mt-4 gap-x-3">
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
                  <span>Add a Book</span>
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
                        Add a Book
                      </label>
                      <label className="label font-bold text-xs">
                        Name of the Book
                      </label>
                      <input
                        className="input input-bordered w-full"
                        name="bookName"
                        value={bookName}
                        onChange={(e) => setBookName(e.target.value)}
                        spellCheck
                        required
                      />
                      <label className="label font-bold text-xs">
                        Code of the Book
                      </label>
                      <input
                        className="input input-bordered w-full"
                        name="bookCode"
                        value={bookCode}
                        onChange={(e) => setBookCode(e.target.value)}
                        spellCheck
                        required
                      />
                      <label className="label font-bold text-xs">
                        Price of the Book{" "}
                      </label>
                      <input
                        className="input input-bordered w-full"
                        name="bookPrice"
                        value={bookPrice}
                        onChange={(e) => setBookPrice(e.target.value)}
                        spellCheck
                        required
                      />
                      <label className="label font-bold text-xs">
                        Copies of the Book{" "}
                      </label>
                      <input
                        className="input input-bordered w-full"
                        name="bookCopies"
                        value={bookCopies}
                        onChange={(e) => setBookCopies(e.target.value)}
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
                                  <span>Name of the Book</span>
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
                              Book Code
                            </th>
                            <th
                              scope="col"
                              className="px-12 py-3.5 text-sm font-normal text-center text-gray-500 dark:text-gray-400"
                            >
                              Book Price
                            </th>
                            <th
                              scope="col"
                              className="px-12 py-3.5 text-sm font-normal text-center text-gray-500 dark:text-gray-400"
                            >
                              Book copies
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                          {store.map((store, index) => (
                            <tr key={index}>
                              <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                                <div className="flex flex-col justify-center items-start">
                                  {store.book_name}
                                </div>
                              </td>
                              <td className="px-12 py-4 text-sm font-medium whitespace-nowrap text-center">
                                <div className="W-auto mt-2  py-1 text-sm font-normal rounded-full text-blue-500 gap-x-2 bg-blue-200 dark:bg-gray-800">
                                  {store.book_code}
                                </div>
                              </td>
                              <td className="px-12 py-4 text-sm font-medium whitespace-nowrap text-center">
                                {store.book_price}
                              </td>
                              <td className="px-12 py-4 text-sm font-medium whitespace-nowrap text-center">
                                {store.book_price}
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

export default Store;
