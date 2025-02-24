// import { createContext, useContext, useState, useEffect } from "react";
// import { jwtDecode } from "jwt-decode";

// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("token") || "");
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const authorizationToken = `Bearer ${token}`;

//   const storeTokenInLS = (serverToken) => {
//     setToken(serverToken);
//     localStorage.setItem("token", serverToken);
//   };

//   const logoutUser = () => {
//     setToken("");
//     setUser(null);
//     localStorage.removeItem("token");
//   };

//   const getUserRole = () => {
//     if (!token) return null;
//     try {
//       const decoded = jwtDecode(token);
//       return decoded.role;
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       return null;
//     }
//   };

//   const mentorAuthentication = async () => {
//     try {
//       const response = await fetch(`${backendUrl}/api/auth/mentor-user`, {
//         method: "GET",
//         headers: { Authorization: authorizationToken },
//       });
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//       const data = await response.json();
//       console.log("Mentor auth response:", data);
//       setUser(data);
//     } catch (error) {
//       setUser(null);
//       console.error("Mentor authentication failed:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const menteeAuthentication = async () => {
//     try {
//       const response = await fetch(`${backendUrl}/api/auth/mentee-user`, {
//         method: "GET",
//         headers: { Authorization: authorizationToken },
//       });
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//       const data = await response.json();
//       console.log("Mentee auth response:", data);
//       setUser(data);
//     } catch (error) {
//       setUser(null);
//       console.error("Mentee authentication failed:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     const role = getUserRole();
//     console.log("Token:", token, "Role:", role);
//     if (!token) {
//       setIsLoading(false);
//       setUser(null);
//       return;
//     }
//     if (role === "mentee") {
//       menteeAuthentication();
//     } else if (role === "mentor") {
//       mentorAuthentication();
//     } else {
//       setIsLoading(false);
//       setUser(null);
//     }
//   }, [token]);

//   const isLoggedIn = !!token;

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, storeTokenInLS, logoutUser, user, authorizationToken, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const authContextValue = useContext(AuthContext);
//   if (!authContextValue) {
//     throw new Error("useAuth used outside of the Provider");
//   }
//   return authContextValue;
// };

import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // New state for role
  const [isLoading, setIsLoading] = useState(true);
  const authorizationToken = `Bearer ${token}`;

  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  const logoutUser = () => {
    setToken("");
    setUser(null);
    setRole(null); // Clear role on logout
    localStorage.removeItem("token");
    setIsLoading(false);
  };

  const getUserRoleFromToken = () => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.role;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const mentorAuthentication = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/mentor-user`, {
        method: "GET",
        headers: { Authorization: authorizationToken },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log("Mentor auth response:", data);
      setUser(data.userData || data); // Handle both nested and flat responses
    } catch (error) {
      console.error("Mentor authentication failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const menteeAuthentication = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/mentee-user`, {
        method: "GET",
        headers: { Authorization: authorizationToken },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log("Mentee auth response:", data);
      setUser(data.userData || data); // Handle both nested and flat responses
    } catch (error) {
      console.error("Mentee authentication failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const tokenRole = getUserRoleFromToken();
    console.log("Token:", token, "Role from token:", tokenRole);
    setRole(tokenRole); // Set role immediately from token

    if (!token) {
      setIsLoading(false);
      setUser(null);
      setRole(null);
      return;
    }

    const authenticate = async () => {
      setIsLoading(true);
      if (tokenRole === "mentee") {
        await menteeAuthentication();
      } else if (tokenRole === "mentor") {
        await mentorAuthentication();
      } else {
        setIsLoading(false);
        setUser(null);
      }
    };

    authenticate();
  }, [token]);

  useEffect(() => {
    console.log("AuthProvider user updated:", user);
    console.log("AuthProvider role:", role);
  }, [user, role]);

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ isLoggedIn, storeTokenInLS, logoutUser, user, role, authorizationToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used outside of the Provider");
  }
  return authContextValue;
};