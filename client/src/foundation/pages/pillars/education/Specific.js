import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function Specific() {
  const [studentDetails, setStudentDetails] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
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
        setImage(data[0].educ_image);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStudentDetails();
  }, [token]);

  if (studentDetails.length === 0) {
    return <p>Nothing</p>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Profile Information */}
      <div className="w-full">
        <img
          className="w-20 h-20 rounded-full mb-2 mx-auto"
          src={image === "" ? image : require("../components/avatar.jpg")}
          alt={name}
        />

        {/* User Information */}
        <h2 className="text-lg font-semibold mb-1 text-center">{name}</h2>
        <p className="text-gray-500 mb-4 text-center">
          Software Development Engineer in Test
        </p>

        {/* Brief Bio */}
        <p className="text-gray-700 text-sm mb-4 text-center">
          Hello, I'm Jemima! I love being warm, kind, and polite to people. In
          my free time, I enjoy coding and exploring new technologies.
        </p>
        {/* Table with Action Buttons */}
        <div className="overflow-x-auto  mb-4">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th></th>
                <th>Level Paid for</th>
                <th>Amount Disbursed</th>
                <th>Confirmation of Pay</th>
              </tr>
            </thead>
            <tbody>
              {studentDetails.map((studentDetail, index) => (
                <tr key={studentDetail.educ_id}>
                  <th>{index + 1}</th>
                  <td>{studentDetail.student_level}</td>
                  <td> {studentDetail.pay_amount}</td>
                  <td>{studentDetail.pay_confirmation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Additional Action Buttons */}
        <div className="flex justify-center">
          <button className="bg-green-500 text-white px-4 py-2 rounded mr-2">
            Add Skill
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Specific;
