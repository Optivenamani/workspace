import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";

const ViewVehicles = () => {
  const [query, setQuery] = useState("")
  return (
    <>
      <Sidebar>
      <div className="flex justify-center items-center mt-2 mb-2">
          <input
            placeholder="Search Vehicle By Reg. Number"
            className="input input-bordered w-full max-w-xs"
            type="text"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="m-4 flex justify-center">
          <div className="overflow-x-auto w-screen">
            <table className="table table-zebra w-full">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Vehicle Registration</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Body Type</th>
                  <th>Engine Capacity (CC)</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <th>1</th>
                  <td>KCY 999R</td>
                  <td>Toyota</td>
                  <td>Coaster</td>
                  <td>Minibus</td>
                  <td>3500</td>
                </tr>
                {/* row 2 */}
                <tr>
                  <th>2</th>
                  <td>KDK 455U</td>
                  <td>Toyota</td>
                  <td>Hiace</td>
                  <td>Van</td>
                  <td>3000</td>
                </tr>
                {/* row 3 */}
                <tr>
                  <th>3</th>
                  <td>KBY 222P</td>
                  <td>Nissan</td>
                  <td>Caravan</td>
                  <td>Van</td>
                  <td>3000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default ViewVehicles;
