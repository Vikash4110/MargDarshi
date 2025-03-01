// src/components/Pagination.jsx
import React from "react";

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => (
  <div className="flex justify-center items-center py-4 space-x-2">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:bg-gray-300 hover:bg-teal-700 transition-colors"
    >
      Previous
    </button>
    <span className="text-gray-700 font-medium">
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:bg-gray-300 hover:bg-teal-700 transition-colors"
    >
      Next
    </button>
  </div>
);

export default Pagination;