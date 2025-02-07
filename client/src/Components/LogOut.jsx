import { useEffect } from "react";
import { useAuth } from "../store/auth";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
export const Logout = () => {
  const { logoutUser } = useAuth();

  useEffect(() => {
    toast.success("Logout Succesfully");
    logoutUser();
  }, [logoutUser]);

  return(
    <>
    <Navigate to="/" />
    </>
  )
};

export default Logout;
