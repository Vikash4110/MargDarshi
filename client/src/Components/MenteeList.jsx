// src/components/MenteeList.jsx
import React from "react";
import { FaEdit, FaTrash, FaUser } from "react-icons/fa";
import Pagination from "./Pagination";

const MenteeList = ({
  mentees,
  searchQuery,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  handleEdit,
  handleDelete,
  editMode,
  editData,
  setEditData,
  handleSave,
  getProfilePictureUrl,
}) => {
  const filterMentees = mentees.filter(
    (mentee) =>
      mentee.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedMentees = filterMentees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filterMentees.length / itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-teal-600 text-white">
          <tr>
            <th className="py-3 px-6 text-left">Profile</th>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Phone</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedMentees.map((mentee) => (
            <tr key={mentee._id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="py-4 px-6">
                {mentee.profilePicture ? (
                  <img
                    src={getProfilePictureUrl(mentee.profilePicture)}
                    alt={mentee.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="text-gray-400 w-10 h-10" />
                )}
              </td>
              <td className="py-4 px-6">
                {editMode?.type === "mentee" && editMode.id === mentee._id ? (
                  <input
                    type="text"
                    value={editData.fullName}
                    onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                    className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  mentee.fullName
                )}
              </td>
              <td className="py-4 px-6">
                {editMode?.type === "mentee" && editMode.id === mentee._id ? (
                  <input
                    type="text"
                    value={editData.phoneNumber || ""}
                    onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                    className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  mentee.phoneNumber || "N/A"
                )}
              </td>
              <td className="py-4 px-6">
                {editMode?.type === "mentee" && editMode.id === mentee._id ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  mentee.email
                )}
              </td>
              <td className="py-4 px-6 flex space-x-3">
                {editMode?.type === "mentee" && editMode.id === mentee._id ? (
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit("mentee", mentee)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete("mentee", mentee._id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default MenteeList;