import { createContext, useContext, useState, useEffect } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const authorizationToken = `Bearer ${token}`;

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
  };

  const logoutUser = () => {
    setToken("");
    localStorage.removeItem("token");
    setUser(null);
  };

  const mentorAuthentication = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/auth/mentor-user`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.userData);
      } else {
        console.error("Error fetching user data");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const menteeAuthentication = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/auth/mentee-user`, {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.userData);
      } else {
        console.error("Error fetching user data");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };


  
  useEffect(() => {
    menteeAuthentication();
    mentorAuthentication();
  }, [authorizationToken]);


  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ isLoggedIn, storeTokenInLS, logoutUser, user, authorizationToken, isLoading, }}>
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

// import { createContext, useContext, useState, useEffect } from "react";

// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("token") || "");
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const authorizationToken = `Bearer ${token}`;

//   useEffect(() => {
//     localStorage.setItem("token", token);
//   }, [token]);

//   const storeTokenInLS = (serverToken) => {
//     setToken(serverToken);
//   };

//   const logoutUser = () => {
//     setToken("");
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   const mentorAuthentication = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${backendUrl}/api/auth/mentor-user`, {
//         method: "GET",
//         headers: {
//           Authorization: authorizationToken,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setUser(data.userData);
//       } else {
//         console.error("Error fetching mentor user data");
//       }
//     } catch (error) {
//       console.error("Mentor authentication error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const menteeAuthentication = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${backendUrl}/api/auth/mentee-user`, {
//         method: "GET",
//         headers: {
//           Authorization: authorizationToken,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setUser(data.userData);
//       } else {
//         console.error("Error fetching mentee user data");
//       }
//     } catch (error) {
//       console.error("Mentee authentication error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       menteeAuthentication();
//       mentorAuthentication();
//     } else {
//       setIsLoading(false);
//     }
//   }, [token]);

//   const isLoggedIn = !!token;

//   return (
//     <AuthContext.Provider
//       value={{ isLoggedIn, storeTokenInLS, logoutUser, user, authorizationToken, isLoading }}
//     >
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