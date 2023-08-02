import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ViewFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch(
          "https://workspace.optiven.co.ke/api/feedback",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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

  const handleView = (item) => {
    console.log("view item:", item);
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="bg-base-200 pt-5 pb-10 min-h-screen min-w-full">
      <div className="block mx-20">
        <label className="label font-bold lausanne mt-5">Feedback</label>
        <table className="table table-zebra w-full bg-base-100 shadow-xl">
          <tbody>
            {feedback.map((item, index) => (
              <tr key={item.id}>
                <td className="flex items-center justify-between py-6">
                  <div className="w-24">
                    <p className="text-xs font-bold lausanne">{index + 1}</p>
                  </div>
                  <div className="w-24">
                    <h1 className="stat-title text-xs lausanne">Name</h1>
                    <p className="text-xs font-bold lausanne">{item.name}</p>
                  </div>
                  <div className="w-1/2">
                    <h1 className="stat-title text-xs lausanne">Comment</h1>
                    <p
                      className="text-xs font-bold lausanne"
                      onClick={() => handleView(item)}
                    >
                      {truncateText(item.feedback, 90)}
                    </p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedItem && (
        <div className="fixed inset-0 flex justify-center items-center z-10 bg-black bg-opacity-50">
          <div className="modal-box container mx-auto">
            <button
              onClick={handleCloseModal}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">
              {selectedItem.name.toUpperCase()}
            </h2>
            <label className="label font-bold">Feedback</label>
            <p className="ml-1 italic">{selectedItem.feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewFeedback;
