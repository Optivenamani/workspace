import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";

const ViewVehicles = () => {
  const [query, setQuery] = useState("");
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
                  <th>Number of Seats</th>
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
                  <td>30</td> {/* add relevant number of seats */}
                </tr>
                {/* row 2 */}
                <tr>
                  <th>2</th>
                  <td>KDK 455U</td>
                  <td>Toyota</td>
                  <td>Hiace</td>
                  <td>Van</td>
                  <td>3000</td>
                  <td>10</td> {/* add relevant number of seats */}
                </tr>
                {/* row 3 */}
                <tr>
                  <th>3</th>
                  <td>KBY 222P</td>
                  <td>Nissan</td>
                  <td>Caravan</td>
                  <td>Van</td>
                  <td>3000</td>
                  <td>7</td> {/* add relevant number of seats */}
                </tr>
                {/* add more rows for additional vehicles */}
                <tr>
                  <th>4</th>
                  <td>KAZ 888X</td>
                  <td>Mercedes-Benz</td>
                  <td>MB 100</td>
                  <td>Minivan</td>
                  <td>2300</td>
                  <td>9</td>
                </tr>
                <tr>
                  <th>5</th>
                  <td>KBA 555P</td>
                  <td>Toyota</td>
                  <td>Liteace</td>
                  <td>Van</td>
                  <td>1800</td>
                  <td>8</td>
                </tr>
                <tr>
                  <th>6</th>
                  <td>KCA 444M</td>
                  <td>Isuzu</td>
                  <td>FRR</td>
                  <td>Bus</td>
                  <td>5193</td>
                  <td>50</td>
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
