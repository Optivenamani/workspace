import React from "react";
import Sidebar from "../components/Sidebar";

const Users = () => {
  return (
    <Sidebar>
      <div className="flex justify-center items-center mt-4 mb-2">
        <input
          placeholder="Search User by Name"
          className="input input-bordered w-full max-w-xs"
          type="text"
        />
      </div>
      <div className="m-4">
        <div className="overflow-x-auto">
          <div className="flex justify-center">
            <table className="table table-zebra w-full">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <th>1</th>
                  <td>Kamau Njoroge</td>
                  <td>Marketer</td>
                  <td>
                    <button className="btn btn-outline btn-warning btn-sm">
                      Edit
                    </button>
                    <button className="btn btn-error text-white btn-sm ml-1">
                      Delete
                    </button>
                  </td>
                </tr>
                {/* row 2 */}
                <tr>
                  <th>2</th>
                  <td>Nekesa Wamalwa</td>
                  <td>Data Analyst</td>
                  <td>
                    <button className="btn btn-outline btn-warning btn-sm">
                      Edit
                    </button>
                    <button className="btn btn-error text-white btn-sm ml-1">
                      Delete
                    </button>
                  </td>
                </tr>
                {/* row 3 */}
                <tr>
                  <th>3</th>
                  <td>Mutua Kaluki</td>
                  <td>Head of Logistics</td>
                  <td>
                    <button className="btn btn-outline btn-warning btn-sm">
                      Edit
                    </button>
                    <button className="btn btn-error text-white btn-sm ml-1">
                      Delete
                    </button>
                  </td>
                </tr>
                {/* row 4 */}
                <tr>
                  <th>4</th>
                  <td>Nyambura Kimani</td>
                  <td>Marketer</td>
                  <td>
                    <button className="btn btn-outline btn-warning btn-sm">
                      Edit
                    </button>
                    <button className="btn btn-error text-white btn-sm ml-1">
                      Delete
                    </button>
                  </td>
                </tr>
                {/* row 5 */}
                <tr>
                  <th>5</th>
                  <td>Kerubo Nyakundi</td>
                  <td>GM</td>
                  <td>
                    <button className="btn btn-outline btn-warning btn-sm">
                      Edit
                    </button>
                    <button className="btn btn-error text-white btn-sm ml-1">
                      Delete
                    </button>
                  </td>
                </tr>
                {/* row 6 */}
                <tr>
                  <th>6</th>
                  <td>Kinyanjui Wainaina</td>
                  <td>Marketer</td>
                  <td>
                    <button className="btn btn-outline btn-warning btn-sm">
                      Edit
                    </button>
                    <button className="btn btn-error text-white btn-sm ml-1">
                      Delete
                    </button>
                  </td>
                </tr>
                {/* row 7 */}
                <tr>
                  <th>7</th>
                  <td>Adhiambo Ochieng</td>
                  <td>Director</td>
                  <td>
                    <button className="btn btn-outline btn-warning btn-sm">
                      Edit
                    </button>
                    <button className="btn btn-error text-white btn-sm ml-1">
                      Delete
                    </button>
                  </td>
                </tr>
                {/* row 8 */}
                <tr>
                  <th>8</th>
                  <td>Njoki Gichuru</td>
                  <td>Marketer</td>
                  <td>
                    <button className="btn btn-outline btn-warning btn-sm">
                      Edit
                    </button>
                    <button className="btn btn-error text-white btn-sm ml-1">
                      Delete
                    </button>
                  </td>
                </tr>
                {/* row 9 */}
                <tr>
                  <th>9</th>
                  <td>Onyango Omondi</td>
                  <td>HOS</td>
                  <td>
                    <button className="btn btn-outline btn-warning btn-sm">
                      Edit
                    </button>
                    <button className="btn btn-error text-white btn-sm ml-1">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default Users;
