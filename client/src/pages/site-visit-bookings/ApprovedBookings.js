import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";

const ApprovedBookings = () => {
  const [query, setQuery] = useState("");

  return (
    <>
      <Sidebar>
        <div className="flex justify-center items-center mt-2 mb-2">
          <input
            placeholder="Search Booking by Date"
            className="input input-bordered w-full max-w-xs mt-2"
            type="text"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="px-4 mt-4 flex justify-center">
          <div className="overflow-x-auto w-screen">
            <table className="table table-zebra w-full">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Site</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Clients</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <th>1</th>
                  <td>Plenty Gardens</td>
                  <td>Machakos</td>
                  <td>2023-03-12</td>
                  <td>12:00</td>
                  <td>1</td>
                </tr>
                {/* row 2 */}
                <tr>
                  <th>2</th>
                  <td>Oasis Greens</td>
                  <td>Kajiado</td>
                  <td>2023-03-12</td>
                  <td>12:00</td>
                  <td>2</td>
                </tr>
                {/* row 3 */}
                <tr>
                  <th>3</th>
                  <td>Spring Valley</td>
                  <td>Ngong'</td>
                  <td>2023-03-12</td>
                  <td>12:00</td>
                  <td>1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default ApprovedBookings;
