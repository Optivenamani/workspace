import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";

const ClientContacts = () => {
  const [query, setQuery] = useState("");
  return (
    <>
      <Sidebar>
        <div className="flex justify-center items-center mt-2 mb-2">
          <input
            placeholder="Search Client by Name"
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
                  <th>INDEX</th>
                  <th>Client Name</th>
                  <th>Client Phone Number</th>
                  <th>Client Email</th>
                  <th>Markter attached to</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <th>1</th>
                  <td>John Smith</td>
                  <td>0712345678</td>
                  <td>client@mail.com</td>
                  <td>John Smith</td>
                  <td>
                    <button className="btn btn-warning btn-outline btn-sm">
                      Edit
                    </button>
                  </td>
                </tr>
                {/* row 2 */}
                <tr>
                  <th>2</th>
                  <td>Abdi Abdul</td>
                  <td>0712345678</td>
                  <td>client@mail.com</td>
                  <td>John Smith</td>
                  <td>
                    <button className="btn btn-warning btn-outline btn-sm">
                      Edit
                    </button>
                  </td>
                </tr>
                {/* row 3 */}
                <tr>
                  <th>3</th>
                  <td>Sara Torres</td>
                  <td>0712345678</td>
                  <td>client@mail.com</td>
                  <td>John Smith</td>
                  <td>
                    <button className="btn btn-warning btn-outline btn-sm">
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default ClientContacts;
