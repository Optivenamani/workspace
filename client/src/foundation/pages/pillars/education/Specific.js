import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";

function Specific() {
  const [studentDetails, setStudentDetails] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [level, setLevel] = useState("");
  const [payInstitution, setPayInstitution] = useState("");
  const [payComment, setPayComment] = useState("");

  const [image, setImage] = useState("");
  const [history, setHistory] = useState("");

  const { id } = useParams();
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/education/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        setStudentDetails(data);
        setName(data[0].educ_name);
        setAge(data[0].educ_age);
        setGender(data[0].educ_gender);
        setPhone(data[0].educ_phone);
        setLevel(data[0].educ_level);
        setImage(data[0].educ_image);
        setHistory(data[0].case_history);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStudentDetails();
  }, [token]);

  return (
    <Sidebar>
      {studentDetails.length === 0 ? (
        <div style={{ textAlign: "center" }}>
          <h2 className=" pt-4 text-3xl font-bold text-gray-800">
            No Payment Information found
          </h2>
          <img
            className="w-1/3 h-50 rounded-full mb-2 mx-auto"
            src={require("../components/404.png")}
            alt="No data found"
          />
        </div>
      ) : (
        <div className="flex flex-col my-4 min-h-screen">
          {/* Profile Information */}
          <div className="w-full">
            <img
              className="w-20 h-20 rounded-full mb-2 mx-auto"
              src={image === "" ? image : require("../components/avatar.jpg")}
              alt={name}
            />

            {/* User Information */}
            <h2 className="text-lg font-semibold mb-1 text-center">{name}</h2>
            <p className="text-gray-500 mb-4 text-center">{level} Student</p>
            <div className="flex gap-4 flex-wrap">
              {/* Left Column */}
              <div className="w-full bg-green-200  rounded-lg shadow-lg mx-4 lg:w-1/4">
                <div className="p-4">
                  <h5 className="font-semibold mb-1">Name</h5>
                  <p className="text-gray-500 mb-4">{name}</p>
                  <h5 className="font-semibold mb-1">Age</h5>
                  <p className="text-gray-500 mb-4">{age}</p>
                  <h5 className="font-semibold mb-1">Gender</h5>
                  <p className="text-gray-500 mb-4">{gender}</p>
                  <h5 className="font-semibold mb-1">Phone Contact</h5>
                  <p className="text-gray-500 mb-4">{phone}</p>
                  <h5 className="font-semibold mb-1">Level of Education</h5>
                  <p className="text-gray-500 mb-4">{level}</p>
                  <h5 className="font-semibold mb-1">Case History</h5>
                  <p className="text-gray-500 mb-4">{history}</p>
                </div>
              </div>

              {/* Right Column (Your existing code) */}

              {/* Table with Action Buttons */}
              <div className="overflow-x-auto mb-4 lg:w-2/3 sm:w-full">
                <table className="table w-full table-zebra">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Institution</th>
                      <th>Level Paid for</th>
                      <th>Amount Disbursed</th>
                      <th>Confirmation of Pay</th>
                      <th>Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentDetails.map((studentDetail, index) => (
                      <tr key={studentDetail.educ_id}>
                        <th>{index + 1}</th>
                        <td>{studentDetail.pay_institution}</td>
                        <td>{studentDetail.student_level}</td>
                        <td> {studentDetail.pay_amount}</td>
                        <td>{studentDetail.pay_confirmation}</td>
                        <td>{studentDetail.pay_comment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-center pt-4">
                  <button className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded">
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Action Buttons */}
          </div>
        </div>
      )}
    </Sidebar>
  );
}

export default Specific;
