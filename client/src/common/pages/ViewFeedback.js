import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ViewFeedback = () => {
  const [feedback, setFeedback] = useState([]);

  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch("https://workspace.optiven.co.ke/api/feedback", {
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

  function truncateText(text, maxLength = 20) {
    if (!text) {
      return "";
    }

    if (text.length <= maxLength) {
      return text;
    } else {
      return text.slice(0, maxLength - 3) + "...";
    }
  }

  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="overflow-x-auto card bg-base-100 shadow-xl">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>feedback</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td className="max-w-sm">
                  {item.feedback === "" || item.feedback === null ? (
                    "NULL"
                  ) : (
                    <div className="tooltip" data-tip={item.feedback}>
                      <p>{truncateText(item.feedback, 125)}</p>
                    </div>
                  )}
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
