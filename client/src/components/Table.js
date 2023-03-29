import React, { useState } from "react";

const Table = ({ columns, data, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalItems = data.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  const renderHeader = () => {
    return (
      <thead>
        <tr className="text-center">
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
          {(onEdit || onDelete) && <th>Actions</th>}
        </tr>
      </thead>
    );
  };

  const renderRows = () => {
    return (
      <tbody>
        {currentItems.map((row) => (
          <tr key={row.id} className="text-center">
            {Object.values(row).map((val) => (
              <td key={val}>{val}</td>
            ))}
            {onEdit && onDelete && (
              <td>
                <div className="flex justify-center">
                  <button
                    className="btn btn-outline btn-warning mr-2 btn-sm"
                    onClick={() => onEdit(row)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline btn-error btn-sm"
                    onClick={() => onDelete(row)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            )}
            {onEdit && !onDelete && (
              <td>
                <button
                  className="btn btn-outline btn-warning btn-sm"
                  onClick={() => onEdit(row)}
                >
                  Edit
                </button>
              </td>
            )}
            {!onEdit && onDelete && (
              <td>
                <button
                  className="btn btn-outline btn-error btn-sm"
                  onClick={() => onDelete(row)}
                >
                  Delete
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    );
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="btn-group mt-2">
        {pageNumbers.map((number) => (
          <button
            key={number}
            className={`btn ${currentPage === number ? "btn-active" : ""}`}
            onClick={() => setCurrentPage(number)}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto w-screen">
      <table className="table table-zebra w-full">
        {renderHeader()}
        {renderRows()}
      </table>
      {totalItems > itemsPerPage && renderPagination()}
    </div>
  );
};

export default Table;
