import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Table from "../../components/Table";

const data = [
  {
    id: 1,
    site: "Ngong'",
    pickupLocation: "ABSA Towers",
    date: "2023-02-28",
    time: "07:00",
    status: "PENDING",
    clientName: "John Smith",
  },
  {
    id: 2,
    site: "Nanyuki",
    pickupLocation: "ABSA Towers",
    date: "2023-02-28",
    time: "07:00",
    status: "APPROVED",
    clientName: "John Smith",
  },
  {
    id: 3,
    site: "Kitengela",
    pickupLocation: "Karen Global Office",
    date: "2023-02-28",
    time: "07:00",
    status: "REJECTED",
    clientName: "John Smith",
  },
  {
    id: 4,
    site: "Machakos",
    pickupLocation: "ABSA Towers",
    date: "2023-02-28",
    time: "07:00",
    status: "COMPLETE",
    clientName: "John Smith",
  },
  {
    id: 5,
    site: "Kiambu",
    pickupLocation: "ABSA Towers",
    date: "2023-02-28",
    time: "07:00",
    status: "PENDING",
    clientName: "John Smith",
  },
  {
    id: 6,
    site: "Murang'a",
    pickupLocation: "Karen Global Office",
    date: "2023-02-28",
    time: "07:00",
    status: "APPROVED",
    clientName: "John Smith",
  },
  {
    id: 7,
    site: "Kajiado",
    pickupLocation: "ABSA Towers",
    date: "2023-02-28",
    time: "07:00",
    status: "REJECTED",
    clientName: "John Smith",
  },
  {
    id: 8,
    site: "Konza",
    pickupLocation: "ABSA Towers",
    date: "2023-02-28",
    time: "07:00",
    status: "PENDING",
    clientName: "John Smith",
  },
  {
    id: 9,
    site: "Ngong'",
    pickupLocation: "Karen Global Office",
    date: "2023-02-28",
    time: "07:00",
    status: "APPROVED",
    clientName: "John Smith",
  },
  {
    id: 10,
    site: "Kitengela",
    pickupLocation: "ABSA Towers",
    date: "2023-02-28",
    time: "07:00",
    status: "PENDING",
    clientName: "John Smith",
  },
  {
    id: 11,
    site: "Nanyuki",
    pickupLocation: "ABSA Towers",
    date: "2023-02-28",
    time: "07:00",
    status: "COMPLETE",
    clientName: "John Smith",
  },
  {
    id: 12,
    site: "Machakos",
    pickupLocation: "Karen Global Office",
    date: "2023-02-28",
    time: "07:00",
    status: "PENDING",
    clientName: "John Smith",
  },
];

const MyBookings = () => {
  const [selectedRow, setSelectedRow] = useState(null);

  const handleEdit = (row) => {
    setSelectedRow(row);
    // open edit modal or navigate to edit page
  };

  return (
    <>
      <Sidebar>
        <div className="px-4 mt-8 flex justify-center">
          <Table
            columns={[
              "ID",
              "Site",
              "Pickup Location",
              "Date",
              "Time",
              "Status",
              "Client Name"
            ]}
            data={data}
            onEdit={handleEdit}
          />
        </div>
      </Sidebar>
    </>
  );
};

export default MyBookings;
