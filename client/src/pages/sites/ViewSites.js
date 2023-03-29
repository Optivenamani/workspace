import React, { useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Table from "../../components/Table";

const data = [
  {
    id: 1,
    siteName: "Plains of Peace",
    siteLocation: "FreeTown",
  },
  {
    id: 2,
    siteName: "Fields of Hope",
    siteLocation: "FreeTown",
  },
  {
    id: 3,
    siteName: "Sweet Valley",
    driverEmail: "Libertyville",
  },
  {
    id: 4,
    siteName: "Ipswich Boulevard",
    siteLocation: "FreeTown",
  },
  {
    id: 5,
    siteName: "Wyth-Upon-Tyre",
    siteLocation: "FreeTown",
  },
  {
    id: 6,
    siteName: "Haute Savoie",
    driverEmail: "Libertyville",
  },
  {
    id: 7,
    siteName: "Annecy Le Vieux",
    siteLocation: "FreeTown",
  },
  {
    id: 8,
    siteName: "Magharib Haven",
    siteLocation: "FreeTown",
  },
  {
    id: 9,
    siteName: "Shaitan Oasis",
    driverEmail: "Libertyville",
  },
  {
    id: 10,
    siteName: "Moneyville",
    siteLocation: "FreeTown",
  },
  {
    id: 11,
    siteName: "Plains of Plenty",
    siteLocation: "FreeTown",
  },
  {
    id: 12,
    siteName: "Entschuldigung",
    driverEmail: "Libertyville",
  },
];

const ViewSites = () => {
  const [query, setQuery] = useState("");
  const handleEdit = (e) => {
    console.log("edit button clicked");
  };
  const handleDelete = (e) => {
    console.log("delete button clicked");
  };

  const filteredSites = useMemo(
    () =>
      // eslint-disable-next-line array-callback-return
      data.filter((site) => {
        if (query === "") {
          return site;
        } else if (site.siteName.toLowerCase().includes(query.toLowerCase())) {
          return site;
        }
      }),
    [query, data]
  );
  return (
    <>
      <Sidebar>
        <div className="flex justify-center items-center mt-2 mb-2">
          <input
            placeholder="Search Site by Name"
            className="input input-bordered w-full max-w-xs"
            type="text"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="px-4 flex justify-center">
          <Table
            columns={["ID", "Site Name", "Site Location"]}
            data={filteredSites}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </Sidebar>
    </>
  );
};

export default ViewSites;
