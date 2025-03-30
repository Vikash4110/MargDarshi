// // src/components/MentorList.jsx
// import React from "react";
// import { FaEdit, FaTrash, FaUser } from "react-icons/fa";
// import Pagination from "./Pagination";

// const MentorList = ({
//   mentors,
//   searchQuery,
//   currentPage,
//   setCurrentPage,
//   itemsPerPage,
//   handleEdit,
//   handleDelete,
//   editMode,
//   editData,
//   setEditData,
//   handleSave,
//   getProfilePictureUrl,
// }) => {
//   const filterMentors = mentors.filter(
//     (mentor) =>
//       mentor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       mentor.email.toLowerCase().includes(searchQuery.toLowerCase())
//   );
//   const paginatedMentors = filterMentors.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );
//   const totalPages = Math.ceil(filterMentors.length / itemsPerPage);

//   return (
//     <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//       <table className="min-w-full">
//         <thead className="bg-teal-600 text-white">
//           <tr>
//             <th className="py-3 px-6 text-left">Profile</th>
//             <th className="py-3 px-6 text-left">Name</th>
//             <th className="py-3 px-6 text-left">Phone</th>
//             <th className="py-3 px-6 text-left">Email</th>
//             <th className="py-3 px-6 text-left">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {paginatedMentors.map((mentor) => (
//             <tr key={mentor._id} className="border-b hover:bg-gray-50 transition-colors">
//               <td className="py-4 px-6">
//                 {mentor.profilePicture ? (
//                   <img
//                     src={getProfilePictureUrl(mentor.profilePicture)}
//                     alt={mentor.fullName}
//                     className="w-10 h-10 rounded-full object-cover"
//                   />
//                 ) : (
//                   <FaUser className="text-gray-400 w-10 h-10" />
//                 )}
//               </td>
//               <td className="py-4 px-6">
//                 {editMode?.type === "mentor" && editMode.id === mentor._id ? (
//                   <input
//                     type="text"
//                     value={editData.fullName}
//                     onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
//                     className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
//                   />
//                 ) : (
//                   mentor.fullName
//                 )}
//               </td>
//               <td className="py-4 px-6">
//                 {editMode?.type === "mentor" && editMode.id === mentor._id ? (
//                   <input
//                     type="text"
//                     value={editData.phoneNumber}
//                     onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
//                     className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
//                   />
//                 ) : (
//                   mentor.phoneNumber
//                 )}
//               </td>
//               <td className="py-4 px-6">
//                 {editMode?.type === "mentor" && editMode.id === mentor._id ? (
//                   <input
//                     type="email"
//                     value={editData.email}
//                     onChange={(e) => setEditData({ ...editData, email: e.target.value })}
//                     className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
//                   />
//                 ) : (
//                   mentor.email
//                 )}
//               </td>
//               <td className="py-4 px-6 flex space-x-3">
//                 {editMode?.type === "mentor" && editMode.id === mentor._id ? (
//                   <button
//                     onClick={handleSave}
//                     className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
//                   >
//                     Save
//                   </button>
//                 ) : (
//                   <>
//                     <button
//                       onClick={() => handleEdit("mentor", mentor)}
//                       className="text-blue-600 hover:text-blue-800 transition-colors"
//                     >
//                       <FaEdit />
//                     </button>
//                     <button
//                       onClick={() => handleDelete("mentor", mentor._id)}
//                       className="text-red-600 hover:text-red-800 transition-colors"
//                     >
//                       <FaTrash />
//                     </button>
//                   </>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
//     </div>
//   );
// };

// export default MentorList;


// src/Components/MentorList.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

const MentorList = ({
  mentors,
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
  handleVerifyMentor,
  getProfilePictureUrl,
  isPendingView,
}) => {
  const [reason, setReason] = useState("");

  const filteredMentors = mentors.filter(
    (mentor) =>
      mentor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMentors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMentors = filteredMentors.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{isPendingView ? "Pending Mentors" : "Verified Mentors"}</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-teal-600 text-white">
            <th className="p-3">Profile</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            {isPendingView && <th className="p-3">Proofs</th>}
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentMentors.map((mentor) => (
            <tr key={mentor._id} className="border-b hover:bg-gray-100 transition-colors">
              <td className="p-3">
                <img
                  src={getProfilePictureUrl(mentor.profilePicture)}
                  alt={mentor.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => (e.target.src = "/default-profile.jpg")}
                />
              </td>
              <td className="p-3">
                {editMode?.type === "mentor" && editMode.id === mentor._id ? (
                  <input
                    type="text"
                    value={editData.fullName}
                    onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  mentor.fullName
                )}
              </td>
              <td className="p-3">
                {editMode?.type === "mentor" && editMode.id === mentor._id ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  mentor.email
                )}
              </td>
              <td className="p-3">
                {editMode?.type === "mentor" && editMode.id === mentor._id ? (
                  <input
                    type="text"
                    value={editData.phoneNumber}
                    onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  mentor.phoneNumber
                )}
              </td>
              {isPendingView && (
                <td className="p-3">
                  <a href={getProfilePictureUrl(mentor.identityProof)} target="_blank" className="text-blue-500 hover:underline">Identity</a>
                  {" | "}
                  <a href={getProfilePictureUrl(mentor.workplaceProof)} target="_blank" className="text-blue-500 hover:underline">Workplace</a>
                </td>
              )}
              <td className="p-3 flex gap-2">
                {editMode?.type === "mentor" && editMode.id === mentor._id ? (
                  <button
                    onClick={handleSave}
                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                  >
                    <FaCheck />
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit("mentor", mentor)}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <FaEdit />
                  </button>
                )}
                <button
                  onClick={() => handleDelete("mentor", mentor._id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <FaTrash />
                </button>
                {isPendingView && (
                  <>
                    <button
                      onClick={() => handleVerifyMentor(mentor._id, "verified")}
                      className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                      title="Approve"
                    >
                      <FaCheck />
                    </button>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Rejection reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="p-1 border rounded text-sm"
                      />
                      <button
                        onClick={() => {
                          if (!reason) {
                            toast.error("Please provide a rejection reason");
                            return;
                          }
                          handleVerifyMentor(mentor._id, "rejected", reason);
                          setReason("");
                        }}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-3">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-300 transition-colors"
          >
            Previous
          </button>
          <span className="self-center text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-300 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default MentorList;