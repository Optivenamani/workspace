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
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>1</th>
                  <td>Cy Ganderton</td>
                  <td>Marketer</td>
                </tr>
                <tr>
                  <th>2</th>
                  <td>Hart Hagerty</td>
                  <td>Head of Sales</td>
                </tr>
                <tr>
                  <th>3</th>
                  <td>Brice Swyre</td>
                  <td>Marketer</td>
                </tr>
                <tr>
                  <th>4</th>
                  <td>Marjy Ferencz</td>
                  <td>Marketer</td>
                </tr>
                <tr>
                  <th>5</th>
                  <td>Yancy Tear</td>
                  <td>General Manager</td>
                </tr>
                <tr>
                  <th>6</th>
                  <td>Irma Vasilik</td>
                  <td>Marketer</td>
                </tr>
                <tr>
                  <th>7</th>
                  <td>Meghann Durtnal</td>
                  <td>Marketer</td>
                </tr>
                <tr>
                  <th>8</th>
                  <td>Sammy Seston</td>
                  <td>Marketer</td>
                </tr>
                <tr>
                  <th>9</th>
                  <td>Lesya Tinham</td>
                  <td>Marketer</td>
                </tr>
                <tr>
                  <th>10</th>
                  <td>Zaneta Tewkesbury</td>
                  <td>VP Marketing</td>
                </tr>
                <tr>
                  <th>11</th>
                  <td>Andy Tipple</td>
                  <td>Librarian</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Job</th>
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
