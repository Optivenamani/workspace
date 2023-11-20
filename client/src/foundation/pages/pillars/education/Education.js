import React, { useState, useCallback, useEffect, useMemo } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../../components/Sidebar";
import { useSelector } from "react-redux";
import axios from "axios";
import Box from "../components/Box";
import { Link } from "react-router-dom";
import avatar from "../../../../assets/avatar.jpg";

const Education = () => {
  const [educName, setEducName] = useState("");
  const [events, setEvents] = useState([]);
  const [educAge, setEducAge] = useState("");
  const [educGender, setEducGender] = useState("");
  const [educPhone, setEducPhone] = useState("");
  const [educLevel, setEducLevel] = useState("");
  const [educAmount, setEducAmount] = useState("");
  const [educHistory, setEducHistory] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [payConfirmation, setPayConfirmation] = useState("");
  const [payInstitution, setPayInstitution] = useState("");
  const [payComment, setPayComment] = useState("");
  const [countyOrigin, setCountyOrigin] = useState("");
  const [educImage, setEducImage] = useState(null);
  // modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [isModal3Open, setIsModal3Open] = useState(false);
  const [isModal4Open, setIsModal4Open] = useState(false);
  const [isModal5Open, setIsModal5Open] = useState(false);

  const [allocatedAmount, setAllocatedAmount] = useState(0);
  const [modifiedAllocatedAmount, setModifiedAllocatedAmount] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");

  const [loading, setLoading] = useState(false);
  const [educ, setEduc] = useState([]);
  const [editEduc, setEditEduc] = useState({
    educ_id: "",
    educ_name: "",
    educ_age: 0,
    educ_gender: "",
    county: "",
    educ_phone: "",
    educ_level: "",
    case_history: "",
    educ_amount: "",
    educ_image: "",
  });
  const [pay, setPay] = useState([]);
  const token = useSelector((state) => state.user.token);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);
  const closedModal = useCallback(() => {
    setIsModal2Open(false);
  }, []);
  const closedModal3 = useCallback(() => {
    setIsModal3Open(false);
  }, []);
  const closedModal4 = useCallback(() => {
    setIsModal4Open(false);
  }, []);
  const closedModal5 = useCallback(() => {
    setIsModal5Open(false);
  }, []);

  const downloadTemplate = () => {
    // Make a GET request to the server endpoint to download the template
    axios({
      url: "http://localhost:8080/api/education/download-template", // Replace with your server endpoint
      method: "GET",
      responseType: "blob", // Important: responseType must be 'blob' for binary data
    })
      .then((response) => {
        // Create a blob from the binary data and create a download link
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "template.xlsx"; // Specify the default download file name
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url); // Clean up the URL object after the download
      })
      .catch((error) => {
        toast.error("Error downloading Excel Sheet", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  const addStudent = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("educ_name", educName);
    formData.append("educ_age", educAge);
    formData.append("educ_gender", educGender);
    formData.append("county", countyOrigin);
    formData.append("educ_phone", educPhone);
    formData.append("educ_level", educLevel);
    formData.append("educ_amount", educAmount);
    formData.append("case_history", educHistory);
    formData.append("educ_image", educImage);

    try {
      const response = await fetch("http://localhost:8080/api/education", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        toast.error("Error adding Student", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.success("Student added successfully!", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      setLoading(false);
      closeModal();

      // Clear the form fields by resetting the form
      e.target.reset(); // This assumes that your form has a reference (ref) attribute set
    } catch (error) {
      toast.error("Error adding Student", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoading(false);
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setEducImage(file);

    // If you need to do something else with the file, you can handle it here
    // For example, you might want to upload the file to a server
    // You can use the 'file' variable to perform actions like uploading.
    // Example:
    // uploadFile(file);
  };

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
      closeModal();
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
  const [file, setFile] = useState(null);

  const onFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/education/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload Response:", response.data);
      toast.success("File uploaded successfully!", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Error uploading file", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (id) => {
    const data =
      Array.isArray(educ) && educ.filter((item) => item.educ_id === id)[0];
    setEditEduc(data);
    console.log("selected for edit", data);
    setIsModal5Open(true);
  };

  const editStudent = async () => {
    const studentDetails = {
      educ_id: editEduc.educ_id,
      educ_name: editEduc.educ_name,
      educ_age: editEduc.educ_age,
      educ_gender: editEduc.educ_gender,
      county: editEduc.county,
      educ_phone: editEduc.educ_phone,
      educ_level: editEduc.educ_level,
      educ_amount: editEduc.educ_amount,
      educ_image: editEduc.educ_image,
      case_history: editEduc.case_history,
    };

    console.log(studentDetails);

    try {
      const response = await fetch(
        `http://localhost:8080/api/education/${editEduc.educ_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(studentDetails),
        }
      );

      if (!response.ok) {
        toast.error("Error editing Student", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        setLoading(false);
        closeModal();
        toast.success("Student details edited successfully!", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error("An error occurred", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoading(false);
    }
  };

  const onUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/amounts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: modifiedAllocatedAmount }),
      });

      setAllocatedAmount(0);

      console.log("Upload Response:", response.data);
      toast.success("Amount Updated successfully!", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsModal3Open(false);
      setAllocatedAmount(modifiedAllocatedAmount);
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Error Updating Amount", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
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
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/events/pillar-count?pillar=Education",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        setEvents(data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchAmounts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/amounts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        const finalAmount = data.filter((item) => item.id === 1)[0].amount;

        setAllocatedAmount(finalAmount);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEducation();
    fetchPayments();
    fetchEvents();
    fetchAmounts();
  }, [token]);

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

  console.log("payment table data", filteredStudentPaymentDetails);

  // Calculate the total sum of educ_amount values
  // Calculate the total sum of pay amounts
  const totalAmount = pay
    .map((item) => item.pay_amount)
    .reduce((sum, amount) => sum + amount, 0);

  return (
    <Sidebar>
      <section className="text-center overflow-x-hidden">
        <div className="container mx-auto text-center mt-4">
          <section className="text-gray-600 body-font">
            <div className="sm:flex sm:items-center sm:justify-between mx-8">
              <div>
                <div className="flex items-center gap-x-3">
                  <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                    Education
                  </h2>
                  <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
                    Welcome 😊
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300 text-start">
                  These are all the Students have been Registered under this
                  Pillar.<br></br>
                  <button
                    onClick={downloadTemplate}
                    className="mt-1 text-sm text-gray-500 dark:text-gray-300 text-start"
                  >
                    Please click below to
                    <div className="underline">Download Excel Sheet</div>
                  </button>
                </p>
              </div>
              {/*ACTION BUTTONS CODE*/}
              <div className="flex items-center mt-4 gap-x-3">
                <button
                  className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
                  onClick={() => setIsModal2Open(true)}
                >
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
                  <span>Import Students</span>
                </button>
                <Modal
                  isOpen={isModal2Open}
                  onRequestClose={closedModal}
                  className="modal-box container mx-auto"
                >
                  {" "}
                  <button
                    onClick={closedModal}
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  >
                    ✕
                  </button>
                  {/* Add your form fields or other content here */}
                  <figure className="px-10 pt-10">
                    <img
                      src="https://media.istockphoto.com/id/1503204764/vector/people-with-cell-phones-use-and-watch-streaming-services-with-clappers-streaming-cinema.jpg?s=612x612&w=0&k=20&c=yz4b0kM_ThXIgOd3Rb75wPr5f0cp5wO6YciDvMTpzhc="
                      alt="Upload"
                      className="rounded-xl"
                    />
                  </figure>
                  <div className="card-body">
                    <form onSubmit={onFormSubmit} encType="multipart/form-data">
                      <label className="label font-bold3">
                        Kindly Upload the Excel Sheet
                      </label>
                      <input
                        type="file"
                        name="file"
                        accept=".xlsx"
                        className="file-input file-input-bordered file-input-primary w-full"
                        required
                      />
                      <button
                        type="submit"
                        className="btn btn-primary w-full mt-2"
                      >
                        {loading ? "Uploading..." : "Upload"}
                      </button>
                    </form>{" "}
                  </div>
                </Modal>
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
                  <span>Register Student</span>
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
                    <form onSubmit={addStudent}>
                      <label className="label font-bold text-xs">
                        Add a Student
                      </label>
                      <label className="label font-bold text-xs">
                        Name of the Student
                      </label>
                      <input
                        className="input input-bordered w-full"
                        name="educName"
                        value={educName}
                        onChange={(e) => setEducName(e.target.value)}
                        spellCheck
                        required
                      />
                      <label className="label font-bold text-xs">
                        Age of the student
                      </label>
                      <input
                        className="input input-bordered w-full"
                        name="educAge"
                        value={educAge}
                        onChange={(e) => setEducAge(e.target.value)}
                        spellCheck
                        required
                      />
                      <label className="label font-bold text-xs">
                        Gender of the Student
                      </label>
                      <select
                        className="input input-bordered w-full"
                        name="educGender"
                        value={educGender}
                        onChange={(e) => setEducGender(e.target.value)}
                        required
                      >
                        <option value="None Selected">
                          Please select Gender
                        </option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                      </select>
                      <label className="label font-bold text-xs">
                        County of Origin of the Student
                      </label>
                      <select
                        className="input input-bordered w-full"
                        name="countyOrigin"
                        value={countyOrigin}
                        onChange={(e) => setCountyOrigin(e.target.value)}
                        spellCheck
                        required
                      >
                        <option value="None selected">
                          Please Pick County
                        </option>
                        <option value="BARINGO">Baringo</option>
                        <option value="BOMET">Bomet</option>
                        <option value="BUNGOMA">Bungoma</option>
                        <option value="BUSIA">Busia</option>
                        <option value="ELGEYO MARAKWET">Elgeyo Marakwet</option>
                        <option value="EMBU">Embu</option>
                        <option value="GARISSA">Garissa</option>
                        <option value="HOMA BAY">Homa Bay</option>
                        <option value="ISIOLO">Isiolo</option>
                        <option value="KAJIADO">Kajiado</option>
                        <option value="KAKAMEGA">Kakamega</option>
                        <option value="KERICHO">Kericho</option>
                        <option value="KIAMBU">Kiambu</option>
                        <option value="KILIFI">Kilifi</option>
                        <option value="KIRINYAGA">Kirinyaga</option>
                        <option value="KISII">Kisii</option>
                        <option value="KISUMU">Kisumu</option>
                        <option value="KITUI">Kitui</option>
                        <option value="KWALE">Kwale</option>
                        <option value="LAIKIPIA">Laikipia</option>
                        <option value="LAMU">Lamu</option>
                        <option value="MACHAKOS">Machakos</option>
                        <option value="MAKUENI">Makueni</option>
                        <option value="MANDERA">Mandera</option>
                        <option value="MERU">Meru</option>
                        <option value="MIGORI">Migori</option>
                        <option value="MARSABIT">Marsabit</option>
                        <option value="MOMBASA">Mombasa</option>
                        <option value="MURANGA">Muranga</option>
                        <option value="NAIROBI">Nairobi</option>
                        <option value="NAKURU">Nakuru</option>
                        <option value="NANDI">Nandi</option>
                        <option value="NAROK">Narok</option>
                        <option value="NYAMIRA">Nyamira</option>
                        <option value="NYANDARUA">Nyandarua</option>
                        <option value="NYERI">Nyeri</option>
                        <option value="SAMBURU">Samburu</option>
                        <option value="SIAYA">Siaya</option>
                        <option value="TAITA TAVETA">Taita Taveta</option>
                        <option value="TANA RIVER">Tana River</option>
                        <option value="THARAKA NITHI">Tharaka Nithi</option>
                        <option value="TRANS NZOIA">Trans Nzoia</option>
                        <option value="TURKANA">Turkana</option>
                        <option value="UASIN GISHU">Uasin Gishu</option>
                        <option value="VIHIGA">Vihiga</option>
                        <option value="WAJIR">Wajir</option>
                        <option value="WEST POKOT">West Pokot</option>
                      </select>

                      <label className="label font-bold text-xs">
                        Phone Contact of the Student
                      </label>
                      <input
                        className="input input-bordered w-full"
                        name="educPhone"
                        value={educPhone}
                        onChange={(e) => setEducPhone(e.target.value)}
                        spellCheck
                        required
                      />
                      <label className="label font-bold text-xs">
                        Select Level of the Student
                      </label>
                      <select
                        className="input input-bordered w-full"
                        name="educLevel"
                        value={educLevel}
                        onChange={(e) => setEducLevel(e.target.value)}
                        required
                      >
                        <option value="None Selected">
                          Please select the initial Educational Level of the
                          Student
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
                        Case History
                      </label>
                      <input
                        className="input input-bordered w-full"
                        name="educHistory"
                        value={educHistory}
                        onChange={(e) => setEducHistory(e.target.value)}
                        spellCheck
                        type="textarea"
                      />
                      <label className="label font-bold text-xs">
                        Upload Student Image
                      </label>
                      <input
                        type="file"
                        name="educ_image"
                        accept=".png, .jpg, .jpeg"
                        onChange={onFileChange}
                        className="file-input file-input-bordered file-input-primary w-full"
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
            {/*BOXES*/}
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
                      {allocatedAmount}
                    </h2>
                    <button
                      className="btn btn-sm btn-outline btn-success"
                      onClick={() => setIsModal3Open(true)}
                    >
                      Update Amount Allocated
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                    <Modal
                      isOpen={isModal3Open}
                      onRequestClose={closedModal3}
                      className="modal-box container mx-auto"
                    >
                      {" "}
                      <button
                        onClick={closedModal3}
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                      >
                        ✕
                      </button>
                      {/* Add your form fields or other content here */}
                      <figure className="px-10 pt-10">
                        <img
                          src="https://media.istockphoto.com/id/1503204764/vector/people-with-cell-phones-use-and-watch-streaming-services-with-clappers-streaming-cinema.jpg?s=612x612&w=0&k=20&c=yz4b0kM_ThXIgOd3Rb75wPr5f0cp5wO6YciDvMTpzhc="
                          alt="Upload"
                          className="rounded-xl"
                        />
                      </figure>
                      <div className="card-body">
                        <form onSubmit={onUpdate}>
                          <label className="label font-bold3 text-center">
                            Kindly Update the Amount
                          </label>
                          <input
                            type="number"
                            value={modifiedAllocatedAmount}
                            onChange={(e) =>
                              setModifiedAllocatedAmount(e.target.value)
                            }
                            className="input input-bordered w-full"
                            max={9999999}
                            maxLength={9999999}
                            required
                          />

                          <button
                            type="submit"
                            className="btn btn-primary w-full mt-2"
                          >
                            {loading ? "Uploading..." : "Upload"}
                          </button>
                        </form>{" "}
                      </div>
                    </Modal>
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
                      {educ.length}
                    </h2>
                    <p className="leading-relaxed">Outreached</p>
                  </div>
                </div>
                <Box
                  figure={events.length}
                  title="Events"
                  svg={
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
                  }
                />
                <Box
                  svg={
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
                  }
                  figure={totalAmount}
                  title="Total Money used"
                />
              </div>
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
                    placeholder="Search student by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="text-center text-dark">
                ~ REGISTERED STUDENTS ~
              </div>
              {/*FIRST TABLE*/}
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
                                  <span>Name of student</span>
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
                              Phone
                            </th>
                            <th
                              scope="col"
                              className="px-12 py-3.5 text-sm font-normal text-center text-gray-500 dark:text-gray-400"
                            >
                              Level of Education
                            </th>
                            <th
                              scope="col"
                              className="px-12 py-3.5 text-sm font-normal text-center text-gray-500 dark:text-gray-400"
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                          {filteredEducated.map((educ, index) => (
                            <tr key={index}>
                              <td className="px-12 py-4 text-sm font-medium whitespace-nowrap text-start">
                                <div className="flex  items-center">
                                  <div className="mask mask-circle w-12 h-12">
                                    <img
                                      src={
                                        educ.educ_image !== null
                                          ? educ.educ_image
                                          : avatar
                                      }
                                      alt={educ.educ_name}
                                      style={{
                                        maxWidth: "50px",
                                        maxHeight: "60px",
                                      }}
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <Link
                                      to={`/specific/${educ.educ_id}`}
                                      className="text-sm hover:underline"
                                    >
                                      {educ.educ_name}
                                    </Link>
                                    <div className="px-3 mt-2 py-1 text-sm font-normal rounded-full text-blue-500 gap-x-2 bg-blue-200 dark:bg-gray-800">
                                      {educ.educ_age} years old
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-12 py-4 text-sm font-medium whitespace-nowrap text-center">
                                {educ.educ_gender}
                              </td>
                              <td className="px-12 py-4 text-sm font-medium whitespace-nowrap text-center">
                                {educ.educ_phone}
                              </td>
                              <td className="px-12 py-4 text-sm font-medium whitespace-nowrap text-center">
                                <div className="inline px-3 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                                  {educ.educ_level}
                                </div>
                              </td>
                              <td className="px-12 py-4 text-sm font-medium whitespace-nowrap text-center">
                                <button
                                  className="btn btn-outline btn-sm"
                                  onClick={() => handleEditClick(educ.educ_id)}
                                >
                                  Edit
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <Modal
                isOpen={isModal5Open}
                onRequestClose={closedModal5}
                className="modal-box container mx-auto"
              >
                {" "}
                <button
                  onClick={closedModal5}
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                  ✕
                </button>
                {/* Add your form fields or other content here */}
                <div>
                  <form onSubmit={editStudent}>
                    <label className="label font-bold text-xs">
                      Edit Student
                    </label>
                    <label className="label font-bold text-xs">
                      Name of the Student
                    </label>
                    <input
                      className="input input-bordered w-full"
                      name="educName"
                      value={editEduc.educ_name}
                      onChange={(e) =>
                        setEditEduc({
                          ...editEduc,
                          educ_name: e.target.value,
                        })
                      }
                      spellCheck
                      required
                    />
                    <label className="label font-bold text-xs">
                      Age of the student
                    </label>
                    <input
                      className="input input-bordered w-full"
                      name="educAge"
                      value={editEduc.educ_age}
                      onChange={(e) =>
                        setEditEduc({
                          ...editEduc,
                          educ_age: e.target.value,
                        })
                      }
                      type="number"
                      spellCheck
                      required
                    />
                    <label className="label font-bold text-xs">
                      Gender of the Student
                    </label>
                    <select
                      className="input input-bordered w-full"
                      name="educGender"
                      value={editEduc.educ_gender}
                      onChange={(e) =>
                        setEditEduc({
                          ...editEduc,
                          educ_gender: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="None Selected">
                        Please select Gender
                      </option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                    <label className="label font-bold text-xs">
                      Phone Contact of the Student or Guardian
                    </label>
                    <input
                      className="input input-bordered w-full"
                      name="educPhone"
                      value={editEduc.educ_phone}
                      onChange={(e) =>
                        setEditEduc({
                          ...editEduc,
                          educ_phone: e.target.value,
                        })
                      }
                      spellCheck
                      required
                    />
                    <label className="label font-bold text-xs">
                      Select Level of the Student
                    </label>
                    <select
                      className="input input-bordered w-full"
                      name="educLevel"
                      value={editEduc.educ_level}
                      onChange={(e) =>
                        setEditEduc({
                          ...editEduc,
                          educ_level: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="None Selected">
                        Please select Initial Educational Level of the Student
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
                      <option value="University">University</option>
                    </select>
                    <label className="label font-bold text-xs">
                      Case History
                    </label>
                    <textarea
                      className="textarea textarea-bordered w-full h-16"
                      name="educHistory"
                      value={editEduc.case_history}
                      onChange={(e) =>
                        setEditEduc({
                          ...editEduc,
                          case_history: e.target.value,
                        })
                      }
                      spellCheck
                    />
                    <label className="label font-bold text-xs">
                      Upload Student Image
                    </label>
                    <input
                      type="file"
                      name="educ_image"
                      accept=".png, .jpg, .jpeg"
                      onChange={onFileChange}
                      className="file-input file-input-bordered file-input-primary w-full"
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
          </section>
        </div>
      </section>
    </Sidebar>
  );
};

export default Education;
