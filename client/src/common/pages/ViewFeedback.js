import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ViewFeedback = () => {
  const [feedback, setFeedback] = useState([]);

  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/feedback", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data);
        setFeedback(data);
      } catch (error) {
        console.error("Error fetching site visits:", error);
      }
    };

    fetchFeedback();
  }, [token]);

  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="overflow-x-auto card bg-base-100 shadow-xl">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>
                  {item.feedback === "" || item.feedback === null
                    ? "NULL"
                    : item.feedback}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewFeedback;
