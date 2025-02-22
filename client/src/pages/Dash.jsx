import React, { useEffect } from "react";
import { useAuth } from "../store/auth";

const Dashboard = () => {
  const { user, isLoading } = useAuth(); // Get user from AuthContext

  useEffect(() => {
    console.log("User in Dashboard:", user); // Debug user data
  }, [user]);

  return (
    <div className="p-4">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <h1 className="text-2xl font-bold">
          Welcome, {user?.name ? user.name : "User"}
        </h1>
      )}
    </div>
  );
};

export default Dashboard;
