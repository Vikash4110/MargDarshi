// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../store/auth";
// import { toast } from "react-toastify";

// const MenteeUpdate = () => {
//   const navigate = useNavigate();
//   const { authorizationToken } = useAuth();
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   const [mentee, setMentee] = useState({
//     fullName: "",
//     email: "",
//     phoneNumber: "",
//     universityName: "",
//     fieldOfStudy: "",
//     expectedGraduationYear: "",
//     careerInterests: "",
//     desiredIndustry: "",
//     skillsToDevelop: "",
//     typeOfMentorshipSought: "",
//     preferredDaysAndTimes: "",
//     preferredMentorshipMode: "",
//     personalIntroduction: "",
//     linkedInProfileUrl: "",
//   });

//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchMenteeData = async () => {
//       try {
//         const response = await fetch(`${backendUrl}/api/auth/mentee-user`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: authorizationToken,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch mentee details.");
//         }

//         const data = await response.json();
//         setMentee(data);
//       } catch (error) {
//         toast.error(error.message || "Something went wrong.");
//       }
//     };

//     fetchMenteeData();
//   }, []);

//   const handleChange = (e) => {
//     setMentee({ ...mentee, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch(`${backendUrl}/api/auth/mentee-update`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: authorizationToken,
//         },
//         body: JSON.stringify(mentee),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update profile.");
//       }

//       toast.success("Profile updated successfully!");
//       navigate("/mentee-user"); // Redirect after 1.5 sec
//     } catch (error) {
//       toast.error(error.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg mt-10">
//       <h2 className="text-2xl font-semibold text-center text-gray-800">Update Your Profile</h2>

//       <form onSubmit={handleSubmit} className="mt-6">
//         {/* Full Name */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium">Full Name</label>
//           <input
//             type="text"
//             name="fullName"
//             value={mentee.fullName}
//             onChange={handleChange}
//             className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
//           />
//         </div>

//         {/* Email (ReadOnly) */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={mentee.email}
//             readOnly
//             className="w-full p-2 border bg-gray-100 rounded"
//           />
//         </div>

//         {/* Phone Number */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium">Phone Number</label>
//           <input
//             type="text"
//             name="phoneNumber"
//             value={mentee.phoneNumber}
//             onChange={handleChange}
//             className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
//           />
//         </div>

//         {/* University Name */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium">University Name</label>
//           <input
//             type="text"
//             name="universityName"
//             value={mentee.universityName}
//             onChange={handleChange}
//             className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
//           />
//         </div>

//         {/* Field of Study */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium">Field of Study</label>
//           <input
//             type="text"
//             name="fieldOfStudy"
//             value={mentee.fieldOfStudy}
//             onChange={handleChange}
//             className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
//           />
//         </div>

//         {/* Preferred Mentorship Mode */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium">Preferred Mentorship Mode</label>
//           <select
//             name="preferredMentorshipMode"
//             value={mentee.preferredMentorshipMode}
//             onChange={handleChange}
//             className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
//           >
//             <option value="">Select</option>
//             <option value="Online">Online</option>
//             <option value="In-Person">In-Person</option>
//           </select>
//         </div>

//         {/* LinkedIn Profile */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium">LinkedIn Profile</label>
//           <input
//             type="text"
//             name="linkedInProfileUrl"
//             value={mentee.linkedInProfileUrl}
//             onChange={handleChange}
//             className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
//           />
//         </div>

//         {/* Submit Button */}
//         <div className="mt-6">
//           <button
//             type="submit"
//             className={`w-full p-3 text-white rounded bg-blue-500 hover:bg-blue-600 ${
//               loading ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//             disabled={loading}
//           >
//             {loading ? "Updating..." : "Update Profile"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default MenteeUpdate;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

const MenteeUpdate = () => {
  const navigate = useNavigate();
  const { authorizationToken } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [mentee, setMentee] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    universityName: "",
    fieldOfStudy: "",
    expectedGraduationYear: "",
    careerInterests: "",
    desiredIndustry: "",
    skillsToDevelop: "",
    typeOfMentorshipSought: "",
    preferredDaysAndTimes: "",
    preferredMentorshipMode: "",
    personalIntroduction: "",
    linkedInProfileUrl: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMenteeData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/auth/mentee-user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorizationToken,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch mentee details.");
        }

        const data = await response.json();
        setMentee(data);
      } catch (error) {
        toast.error(error.message || "Something went wrong.");
      }
    };

    fetchMenteeData();
  }, []);

  const handleChange = (e) => {
    setMentee({ ...mentee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/auth/mentee-update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify(mentee),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile.");
      }

      toast.success("Profile updated successfully!");
      navigate("/mentee-user");
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900">Update Your Profile</h2>
          <p className="mt-2 text-sm text-gray-600">
            Keep your information up to date to get the best mentorship experience
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
            <div className="px-6 py-5 space-y-6">
              {/* Full Name */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={mentee.fullName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                {/* Email (ReadOnly) */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={mentee.email}
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={mentee.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Education Section */}
            <div className="px-6 py-5 border-t border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Education Information</h3>
            </div>
            <div className="px-6 py-5 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* University Name */}
                <div>
                  <label htmlFor="universityName" className="block text-sm font-medium text-gray-700">
                    University/Institution
                  </label>
                  <input
                    type="text"
                    name="universityName"
                    id="universityName"
                    value={mentee.universityName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                {/* Field of Study */}
                <div>
                  <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700">
                    Field of study
                  </label>
                  <input
                    type="text"
                    name="fieldOfStudy"
                    id="fieldOfStudy"
                    value={mentee.fieldOfStudy}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Mentorship Preferences */}
            <div className="px-6 py-5 border-t border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Mentorship Preferences</h3>
            </div>
            <div className="px-6 py-5 space-y-6">
              {/* Preferred Mentorship Mode */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="preferredMentorshipMode" className="block text-sm font-medium text-gray-700">
                    Preferred mentorship mode
                  </label>
                  <select
                    name="preferredMentorshipMode"
                    id="preferredMentorshipMode"
                    value={mentee.preferredMentorshipMode}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select an option</option>
                    <option value="Online">Online</option>
                    <option value="In-Person">In-Person</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              {/* LinkedIn Profile */}
              <div>
                <label htmlFor="linkedInProfileUrl" className="block text-sm font-medium text-gray-700">
                  LinkedIn Profile URL
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    https://
                  </span>
                  <input
                    type="text"
                    name="linkedInProfileUrl"
                    id="linkedInProfileUrl"
                    value={mentee.linkedInProfileUrl}
                    onChange={handleChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                    placeholder="linkedin.com/in/yourprofile"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="px-6 py-4 bg-gray-50 text-right">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MenteeUpdate;