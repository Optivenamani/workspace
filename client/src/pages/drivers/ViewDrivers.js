import React, { useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Table from "../../components/Table";

const data = [
  {
    id: 1,
    driverName: "Michelle Hawke",
    pickupLocation: "diver@mail.com",
    driverPhoneNumber: "0712345678",
    driverAddress: "69420, Nice, FR.",
  },
  {
    id: 2,
    driverName: "Jane Doe",
    pickupLocation: "diver@mail.com",
    driverPhoneNumber: "0712345678",
    driverAddress: "69420, Nice, FR.",
  },
  {
    id: 3,
    driverName: "Peter Schmidt",
    driverEmail: "driver@mail.com",
    driverPhoneNumber: "0712345678",
    driverAddress: "69420, Nice, FR.",
  },
  {
    id: 4,
    driverName: "John Smith",
    pickupLocation: "diver@mail.com",
    driverPhoneNumber: "0712345678",
    driverAddress: "69420, Nice, FR.",
  },
  {
    id: 5,
    driverName: "Sarah Myers",
    pickupLocation: "diver@mail.com",
    driverPhoneNumber: "0712345678",
    driverAddress: "69420, Nice, FR.",
  },
  {
    id: 6,
    driverName: "Yves Dupont",
    driverEmail: "driver@mail.com",
    driverPhoneNumber: "0712345678",
    driverAddress: "69420, Nice, FR.",
  },
  {
    id: 7,
    driverName: "Hans Mueller",
    pickupLocation: "diver@mail.com",
    driverPhoneNumber: "0712345678",
    driverAddress: "69420, Nice, FR.",
  },
  {
    id: 8,
    driverName: "Enzo Michaedo",
    pickupLocation: "diver@mail.com",
    driverPhoneNumber: "0712345678",
    driverAddress: "69420, Nice, FR.",
  },
  {
    id: 9,
    driverName: "Ali Fazul",
    driverEmail: "driver@mail.com",
    driverPhoneNumber: "0712345678",
    driverAddress: "69420, Nice, FR.",
  },
  {
    id: 10,
    driverName: "Peter Schmidt",
    pickupLocation: "diver@mail.com",
    driverPhoneNumber: "0712345678",
    driverAddress: "69420, Nice, FR.",
  },
  {
    id: 11,
    driverName: "Jane Doe",
    pickupLocation: "diver@mail.com",
    driverPhoneNumber: "0712345678",
    driverAddress: "69420, Nice, FR.",
  },
  {
    id: 12,
    driverName: "John Smith",
    driverEmail: "driver@mail.com",
    driverPhoneNumber: "0712345678",
    driverAddress: "69420, Nice, FR.",
  },
];

const ViewDrivers = () => {
  const [query, setQuery] = useState("");
  const handleEdit = (e) => {
    console.log("edit button clicked");
  };
  const handleDelete = (e) => {
    console.log("delete button clicked");
  };

  const filteredDrivers = useMemo(
    () =>
      // eslint-disable-next-line array-callback-return
      data.filter((driver) => {
        if (query === "") {
          return driver;
        } else if (
          driver.driverName.toLowerCase().includes(query.toLowerCase())
        ) {
          return driver;
        }
      }),
    [query, data]
  );

  return (
    <>
      <Sidebar>
        <div className="flex justify-center items-center mt-2 mb-2">
          <input
            placeholder="Search Driver by Name"
            className="input input-bordered w-full max-w-xs"
            type="text"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="px-4 flex justify-center">
          <Table
            columns={[
              "ID",
              "Driver Name",
              "Driver Email",
              "Driver Phone Number",
              "Driver Address",
            ]}
            data={filteredDrivers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </Sidebar>
    </>
  );
};

export default ViewDrivers;
