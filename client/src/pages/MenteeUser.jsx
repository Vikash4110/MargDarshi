import React, { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

const MenteeProfile = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { authorizationToken } = useAuth();

    const [mentee, setMentee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenteeDetails = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/auth/mentee-user`, {
                    method: "GET",
                    headers: {
                        Authorization: authorizationToken,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch mentee details");
                }

                const data = await response.json();
                setMentee(data);
                setLoading(false);
            } catch (err) {
                setError(err.message || "Error fetching mentee details");
                setLoading(false);
            }
        };

        fetchMenteeDetails();
    }, [authorizationToken]);

    if (loading) {
        return <p className="text-center text-lg font-semibold text-blue-500">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-lg font-semibold text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Mentee Profile</h2>

            <div className="flex flex-col items-center">
                {/* Profile Image */}
                {mentee.profilePicture && (
                    <img
                        src={mentee.profilePicture}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-blue-500 mb-4"
                    />
                )}

                {/* Basic Info */}
                <h3 className="text-xl font-semibold">{mentee.fullName}</h3>
                <p className="text-gray-500">{mentee.email}</p>
                <p className="text-gray-600">{mentee.phoneNumber}</p>

                {/* Education Details */}
                <div className="mt-6 w-full">
                    <h4 className="text-lg font-semibold text-blue-600">Education</h4>
                    <p><strong>University:</strong> {mentee.universityName}</p>
                    <p><strong>Field of Study:</strong> {mentee.fieldOfStudy}</p>
                    <p><strong>Graduation Year:</strong> {mentee.expectedGraduationYear}</p>
                </div>

                {/* Career Interests */}
                <div className="mt-4 w-full">
                    <h4 className="text-lg font-semibold text-blue-600">Career Interests</h4>
                    <p>{mentee.careerInterests?.join(", ") || "Not specified"}</p>
                </div>

                {/* Desired Industry */}
                <div className="mt-4 w-full">
                    <h4 className="text-lg font-semibold text-blue-600">Desired Industry</h4>
                    <p>{mentee.desiredIndustry?.join(", ") || "Not specified"}</p>
                </div>

                {/* Skills to Develop */}
                <div className="mt-4 w-full">
                    <h4 className="text-lg font-semibold text-blue-600">Skills to Develop</h4>
                    <p>{mentee.skillsToDevelop?.join(", ") || "Not specified"}</p>
                </div>

                {/* Mentorship Preferences */}
                <div className="mt-4 w-full">
                    <h4 className="text-lg font-semibold text-blue-600">Mentorship Preferences</h4>
                    <p><strong>Type:</strong> {mentee.typeOfMentorshipSought?.join(", ") || "Not specified"}</p>
                    <p><strong>Preferred Mode:</strong> {mentee.preferredMentorshipMode || "Not specified"}</p>
                    <p><strong>Preferred Days & Times:</strong> {mentee.preferredDaysAndTimes?.join(", ") || "Not specified"}</p>
                </div>

                {/* LinkedIn Profile */}
                {mentee.linkedInProfileUrl && (
                    <div className="mt-4">
                        <a
                            href={mentee.linkedInProfileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline font-semibold"
                        >
                            View LinkedIn Profile
                        </a>
                    </div>
                )}

                {/* Personal Introduction */}
                <div className="mt-6 w-full bg-gray-100 p-4 rounded-lg shadow-sm">
                    <h4 className="text-lg font-semibold text-blue-600">Personal Introduction</h4>
                    <p className="text-gray-600">{mentee.personalIntroduction || "Not provided"}</p>
                </div>
            </div>
        </div>
    );
};

export default MenteeProfile;
