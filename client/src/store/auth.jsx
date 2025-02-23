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
//       if (response.ok) {
//         const data = await response.json();
//         setUser(data.userData);
//       }
//     } catch (error) {
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
//       if (response.ok) {
//         const data = await response.json();
//         setUser(data.userData);
//       }
//     } catch (error) {
//       console.error("Mentee authentication failed:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     const role = getUserRole();
//     if (role === "mentee") {
//       menteeAuthentication();
//     } else if (role === "mentor") {
//       mentorAuthentication();
//     } else {
//       setIsLoading(false); // No valid token or role
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
  
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
  
//       const text = await response.text(); // Get the raw response text
//       console.log("Raw response text:", text); // Log the raw response
  
//       let data;
//       try {
//         data = JSON.parse(text); // Try to parse the response as JSON
//       } catch (error) {
//         throw new Error("Invalid JSON response");
//       }
  
//       if (data && data.userData) {
//         setUser(data.userData);
//       } else {
//         setUser(null);
//       }
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
//       if (response.ok) {
//         const data = await response.json();
//         setUser(data.userData);
//       } else {
//         setUser(null);
//       }
//     } catch (error) {
//       setUser(null);
//       console.error("Mentee authentication failed:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     const role = getUserRole();
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
  const [isLoading, setIsLoading] = useState(true);
  const authorizationToken = `Bearer ${token}`;

  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  const logoutUser = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };

  const getUserRole = () => {
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
      console.log("Mentor auth response:", data); // Log response
      // Assuming the API returns the user object directly
      setUser(data); // Directly set data as user
    } catch (error) {
      setUser(null);
      console.error("Mentor authentication failed:", error);
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
      setUser(data); // Directly set data as user
    } catch (error) {
      setUser(null);
      console.error("Mentee authentication failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const role = getUserRole();
    console.log("Token:", token, "Role:", role);
    if (!token) {
      setIsLoading(false);
      setUser(null);
      return;
    }
    if (role === "mentee") {
      menteeAuthentication();
    } else if (role === "mentor") {
      mentorAuthentication();
    } else {
      setIsLoading(false);
      setUser(null);
    }
  }, [token]);

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ isLoggedIn, storeTokenInLS, logoutUser, user, authorizationToken, isLoading }}>
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